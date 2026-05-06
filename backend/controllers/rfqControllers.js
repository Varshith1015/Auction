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

  const now = new Date();
  const forcedBidCloseTime = new Date(rfq.forced_bid_close_time);

  if (now > forcedBidCloseTime) {
    return res.status(400).json({
      message: "Auction is force closed. Bidding is not allowed.",
    });
  }


  const totalAmount =
    Number(req.body.freight_charges) +
    Number(req.body.origin_charges) +
    Number(req.body.destination_charges);
  const newBid = {
    id: bids.length + 1,
    rfq_id: rfqId,
    supplier_name: req.body.supplier_name,
    freight_charges: req.body.freight_charges,
    origin_charges: req.body.origin_charges,
    destination_charges: req.body.destination_charges,
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

  res.status(201).json({
    message: "Bid submitted successfully",
    data: newBid,
  });
};








