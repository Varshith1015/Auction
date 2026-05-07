# API Documentation - British Auction RFQ System

## 1. Create RFQ

POST /api/rfqs

Creates a new RFQ with British Auction configuration.

Request Body:
- rfq_name
- reference_id
- bid_start_time
- bid_close_time
- forced_bid_close_time
- pickup_service_date
- trigger_window_minutes
- extension_duration_minutes
- extension_trigger_type

Valid extension_trigger_type:
- BID_RECEIVED
- ANY_RANK_CHANGE
- L1_CHANGE



## 2. Get All RFQs

GET /api/rfqs

Returns all RFQs with:
- current lowest bid
- current close time
- forced close time
- status


## 3. Get RFQ Details

GET /api/rfqs/:id

Returns:
- RFQ details
- auction configuration
- supplier bids
- supplier rankings
- activity logs



## 4. Submit Bid

POST /api/rfqs/:id/bids

Submits supplier bid and checks:
- auction status
- forced close validation
- trigger window validation
- extension logic



## 5. Close Auction

POST /api/rfqs/:id/close

Closes auction manually.


