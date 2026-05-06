let rfqs = [];
let auctionConfigs=[];
let bids = [];
let auctionActivityLogs = [];

export const createRFQ = (req, res) => {

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
  res.status(200).json({
    message: "RFQs fetched successfully",
    data: rfqs,
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

  const now = new Date();
  
  const forcedBidCloseTime = new Date(rfq.forced_bid_close_time);
  const currentBidCloseTime = new Date(
    rfq.bid_close_time
  );
  if (now > currentBidCloseTime || now > forcedBidCloseTime) {
    return res.status(400).json({
      message: "Auction is closed. Bidding is not allowed.",
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
  bids.push(newBid);

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
  if (isInsideTriggerWindow) {
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

    const oldCloseTime = rfq.bid_close_time;

    rfq.bid_close_time = finalCloseTime.toISOString();

    const extensionLog = {
      id: auctionActivityLogs.length + 1,
      rfq_id: rfqId,
      activity_type: "TIME_EXTENDED",
      message: `Auction extended due to bid submission by ${req.body.supplier_name}`,
      old_bid_close_time: oldCloseTime,
      new_bid_close_time: finalCloseTime.toISOString(),
      created_at: new Date(),
    };

    auctionActivityLogs.push(extensionLog);
  }
  res.status(201).json({
    message: "Bid submitted successfully",
    data: newBid,
  });
};


