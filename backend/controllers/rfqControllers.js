let rfqs = [];
let auctionConfigs=[];
let bids = [];
let auctionActivityLogs = [];

export const createRFQ = (req, res) => {

  const requiredFields = [
    "rfq_name",
    "reference_id",
    "bid_start_time",
    "bid_close_time",
    "forced_bid_close_time",
    "pickup_service_date",
    "trigger_window_minutes",
    "extension_duration_minutes",
    "extension_trigger_type",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required`,
      });
    }
  }

  const bidCloseTime = new Date(req.body.bid_close_time);
  const forcedBidCloseTime = new Date(req.body.forced_bid_close_time);
  if (forcedBidCloseTime <= bidCloseTime) {
    return res.status(400).json({
      message: "Forced bid close time must be greater than bid close time",
    });
  }
  const newRFQ = {
    id: rfqs.length + 1,
    rfq_name: req.body.rfq_name,
    reference_id: req.body.reference_id,
    bid_start_time: req.body.bid_start_time,
    bid_close_time: req.body.bid_close_time,
    forced_bid_close_time: req.body.forced_bid_close_time,
    pickup_service_date: req.body.pickup_service_date,
    status: "ACTIVE",
    created_at: new Date(),
  };
  rfqs.push(newRFQ);

  const newAuctionConfig = {
    id: auctionConfigs.length + 1,
    rfq_id: newRFQ.id,
    trigger_window_minutes: req.body.trigger_window_minutes,
    extension_duration_minutes: req.body.extension_duration_minutes,
    extension_trigger_type: req.body.extension_trigger_type,
  };
  auctionConfigs.push(newAuctionConfig);

  res.status(201).json({
    message: "RFQ created successfully",
    data: newRFQ,
    auction_config: newAuctionConfig,
  });
};

export const getAllRFQs = (req, res) => {
  const rfqList = rfqs.map((rfq) => {
    const rfqBids = bids.filter((bid) => bid.rfq_id === rfq.id);
    const lowestBid =
      rfqBids.length > 0
        ? Math.min(...rfqBids.map((bid) => bid.total_amount))
        : null;
    return {
      id: rfq.id,
      rfq_name: rfq.rfq_name,
      reference_id: rfq.reference_id,
      current_lowest_bid: lowestBid,
      bid_close_time: rfq.bid_close_time,
      forced_bid_close_time: rfq.forced_bid_close_time,
      status: rfq.status,
    };
  });
  res.status(200).json({
    message: "RFQs fetched successfully",
    data: rfqList,
  });
};

export const getRFQById = (req, res) => {
  const rfqId = Number(req.params.id);
  const rfq = rfqs.find((item) => item.id === rfqId);
  if (!rfq) {
    return res.status(404).json({
      message: "RFQ not found",
    });
  }
  const auctionConfig = auctionConfigs.find(
    (config) => config.rfq_id === rfqId
  );
  const rfqBids = bids
    .filter((bid) => bid.rfq_id === rfqId)
    .sort((a, b) => a.total_amount - b.total_amount)
    .map((bid, index) => {
      return {
        ...bid,
        rank: `L${index + 1}`,
      };
    });
  const rfqLogs = auctionActivityLogs.filter(
    (log) => log.rfq_id === rfqId
  );
  res.status(200).json({
    message: "RFQ fetched successfully",
    data: rfq,
    auction_config: auctionConfig,
    bids: rfqBids,
    logs: rfqLogs,
  });
};

export const submitBid = (req, res) => {


   if (!req.body.supplier_name) {
    return res.status(400).json({
      message: "supplier_name is required",
    });
  }
  const rfqId = Number(req.params.id);
  const rfq = rfqs.find((item) => item.id === rfqId);
  if (!rfq) {
    return res.status(404).json({
      message: "RFQ not found",
    });
  }
  if (rfq.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Auction is not active",
    });
  }
 
  const auctionConfig = auctionConfigs.find(
    (config) => config.rfq_id === rfqId
  );

  if (!auctionConfig) {
    return res.status(404).json({
      message: "Auction configuration not found",
    });
  }

  const requiredBidFields = [
    "supplier_name",
    "freight_charges",
    "origin_charges",
    "destination_charges",
    "transit_time",
    "quote_validity",
  ];

  for (const field of requiredBidFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required`,
      });
    }
  }

  const now = new Date();
  
  const forcedBidCloseTime = new Date(rfq.forced_bid_close_time);
  const currentBidCloseTime = new Date(
    rfq.bid_close_time
  );
  if (now > forcedBidCloseTime) {
    rfq.status = "FORCE_CLOSED";

    return res.status(400).json({
      message: "Auction is force closed. Bidding is not allowed.",
    });
  }

  const triggerWindowStart = new Date(
    currentBidCloseTime.getTime() -
      auctionConfig.trigger_window_minutes * 60 * 1000
  );

  const isInsideTriggerWindow =now >= triggerWindowStart && now <= currentBidCloseTime;
  
  const freight = Number(req.body.freight_charges);
  const origin = Number(req.body.origin_charges);
  const destination = Number(req.body.destination_charges);

  if (Number.isNaN(freight) || Number.isNaN(origin) || Number.isNaN(destination)) {
    return res.status(400).json({
      message: "freight_charges, origin_charges, and destination_charges must be numbers",
    });
  }

  const totalAmount = freight + origin + destination;
  const newBid = {
    id: bids.length + 1,
    rfq_id: rfqId,
    supplier_name: req.body.supplier_name,
    freight_charges: freight,
    origin_charges: origin,
    destination_charges: destination,
    total_amount: totalAmount,
    transit_time: req.body.transit_time,
    quote_validity: req.body.quote_validity,
    created_at: new Date(),
  };

  const previousRankings = bids
  .filter((bid) => bid.rfq_id === rfqId)
  .sort((a, b) => a.total_amount - b.total_amount)
  .map((bid) => bid.supplier_name);

  bids.push(newBid);
  const newRankings = bids
    .filter((bid) => bid.rfq_id === rfqId)
    .sort((a, b) => a.total_amount - b.total_amount)
    .map((bid) => bid.supplier_name);
  const isAnyRankChanged =
    previousRankings.join(",") !== newRankings.join(",");
  const previousL1 = previousRankings[0];
  const newL1 = newRankings[0];
  const isL1Changed = previousL1 !== newL1;

  const bidLog = {
    id: auctionActivityLogs.length + 1,
    rfq_id: rfqId,
    activity_type: "BID_SUBMITTED",
    message: `${req.body.supplier_name} submitted a bid with total amount ${totalAmount}`,
    old_bid_close_time: null,
    new_bid_close_time: null,
    created_at: new Date(),
  };
  auctionActivityLogs.push(bidLog);
  let extensionReason = "";
  if (
    isInsideTriggerWindow &&
    auctionConfig.extension_trigger_type === "BID_RECEIVED"
  ) {
    extensionReason = "Bid received inside trigger window";
  }
  if (
    isInsideTriggerWindow &&
    auctionConfig.extension_trigger_type === "ANY_RANK_CHANGE" &&
    isAnyRankChanged
  ) {
    extensionReason = "Supplier ranking changed inside trigger window";
  }
  if (
    isInsideTriggerWindow &&
    auctionConfig.extension_trigger_type === "L1_CHANGE" &&
    isL1Changed
  ) {
    extensionReason = "Lowest bidder changed inside trigger window";
  }
  const shouldExtend = extensionReason !== "";
  let extensionLog = null;
  if (shouldExtend) {
    const extendedCloseTime = new Date(
      currentBidCloseTime.getTime() +
        auctionConfig.extension_duration_minutes *
          60 *
          1000
    );
    const finalCloseTime =
      extendedCloseTime > forcedBidCloseTime
        ? forcedBidCloseTime
        : extendedCloseTime;
    const oldCloseTime = new Date(rfq.bid_close_time);
    rfq.bid_close_time = finalCloseTime.toISOString();

    extensionLog = {
      id: auctionActivityLogs.length + 1,
      rfq_id: rfqId,
      activity_type: "TIME_EXTENDED",
      message: `Auction extended due to bid submission by ${req.body.supplier_name}`,
      old_bid_close_time: oldCloseTime.toISOString(),
      new_bid_close_time: finalCloseTime.toISOString(),
      created_at: new Date(),
    };
    auctionActivityLogs.push(extensionLog);
  }
  res.status(201).json({
    message: "Bid submitted successfully",
    data: newBid,
    auction_extended: shouldExtend,
    extension_log: extensionLog,
    updated_bid_close_time: rfq.bid_close_time,
  });
};

export const closeAuction = (req, res) => {
  const rfqId = Number(req.params.id);
  const rfq = rfqs.find((item) => item.id === rfqId);
  if (!rfq) {
    return res.status(404).json({
      message: "RFQ not found",
    });
  }
  rfq.status = "CLOSED";
  const closeLog = {
    id: auctionActivityLogs.length + 1,
    rfq_id: rfqId,
    activity_type: "AUCTION_CLOSED",
    message: "Auction closed manually",
    old_bid_close_time: null,
    new_bid_close_time: null,
    created_at: new Date(),
  };
  auctionActivityLogs.push(closeLog);
  res.status(200).json({
    message: "Auction closed successfully",
    data: rfq,
  });
};
