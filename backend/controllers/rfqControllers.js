let rfqs = [];
let auctionConfigs=[];
let bids = [];

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
  res.status(200).json({
    message: "RFQ fetched successfully",
    data: rfq,
    auction_config: auctionConfig,
  });
};









