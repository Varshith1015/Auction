# API Documentation - British Auction RFQ System

## 1. Create RFQ

### Endpoint
POST /api/rfqs

### Purpose
Creates a new RFQ with British Auction configuration.

### Controller Logic
1. Validate required RFQ fields.
2. Validate `extension_trigger_type`.
3. Check that `forced_bid_close_time` is greater than `bid_close_time`.
4. Create RFQ with default status `ACTIVE`.
5. Store British Auction config separately using the created RFQ id.
6. Return created RFQ and auction configuration.

### Required Fields
- rfq_name
- reference_id
- bid_start_time
- bid_close_time
- forced_bid_close_time
- pickup_service_date
- trigger_window_minutes
- extension_duration_minutes
- extension_trigger_type

### Allowed Trigger Types
- BID_RECEIVED
- ANY_RANK_CHANGE
- L1_CHANGE

### Success Response
Returns:
- RFQ details
- auction configuration

### Error Responses
- Missing field
- Invalid trigger type
- Forced close time less than or equal to bid close time


---

## 2. Get All RFQs

### Endpoint
GET /api/rfqs

### Purpose
Returns all RFQs for the auction listing page.

### Controller Logic
1. Loop through all RFQs.
2. Dynamically update auction status:
   - If current time is greater than forced close time → `FORCE_CLOSED`
   - Else if current time is greater than bid close time → `CLOSED`
   - Else keep status as `ACTIVE`
3. Find all bids for each RFQ.
4. Calculate current lowest bid.
5. Return listing-friendly RFQ data.

### Response Includes
- RFQ id
- RFQ name
- Reference id
- Current lowest bid
- Current bid close time
- Forced bid close time
- Auction status


---

## 3. Get RFQ Details

### Endpoint
GET /api/rfqs/:id

### Purpose
Returns complete auction details for one RFQ.

### Controller Logic
1. Find RFQ by id.
2. If RFQ does not exist, return 404.
3. Dynamically update auction status based on current time.
4. Find auction configuration for the RFQ.
5. Find all bids for the RFQ.
6. Sort bids by lowest total amount.
7. Assign supplier ranking:
   - Lowest bid → L1
   - Second lowest → L2
   - Third lowest → L3
8. Fetch activity logs for the RFQ.
9. Return full auction details.

### Response Includes
- RFQ details
- Auction configuration
- Bids sorted by price
- Supplier ranking
- Activity logs


---

## 4. Submit Bid

### Endpoint
POST /api/rfqs/:id/bids

### Purpose
Allows a supplier to submit a bid for an active RFQ.

### Controller Logic
1. Read RFQ id from request params.
2. Find RFQ by id.
3. If RFQ does not exist, return 404.
4. Check RFQ status:
   - If not `ACTIVE`, bidding is not allowed.
5. Check forced close time:
   - If current time is greater than forced close time, update status to `FORCE_CLOSED` and reject bid.
6. Check current bid close time:
   - If current time is greater than bid close time, reject bid.
7. Validate required bid fields.
8. Fetch auction configuration.
9. Capture previous supplier ranking before saving new bid.
10. Calculate total bid amount:

   total_amount = freight_charges + origin_charges + destination_charges

11. Save new bid.
12. Add activity log with type `BID_SUBMITTED`.
13. Recalculate new supplier ranking after saving bid.
14. Check whether ranking changed:
   - `isAnyRankChanged`
   - `isL1Changed`
15. Check whether current time is inside trigger window:

   trigger_window_start = bid_close_time - trigger_window_minutes

16. Decide whether auction should extend based on trigger type:
   - `BID_RECEIVED`: extend if bid is inside trigger window
   - `ANY_RANK_CHANGE`: extend if ranking changed inside trigger window
   - `L1_CHANGE`: extend if lowest bidder changed inside trigger window
17. If extension is valid:
   - Add extension duration to current bid close time
   - Do not allow new close time to cross forced close time
   - Update RFQ bid close time
   - Add `TIME_EXTENDED` activity log
18. Return bid details and extension status.

### Response Includes
- Submitted bid
- Whether auction was extended
- Extension log if extension happened
- Updated bid close time

### Error Responses
- RFQ not found
- Auction is not active
- Auction is force closed
- Auction is closed
- Missing bid field


---

## 5. Close Auction

### Endpoint
POST /api/rfqs/:id/close

### Purpose
Manually closes an active auction.

### Controller Logic
1. Find RFQ by id.
2. If RFQ does not exist, return 404.
3. Update RFQ status to `CLOSED`.
4. Add activity log with type `AUCTION_CLOSED`.
5. Return updated RFQ.

### Response Includes
- Updated RFQ with `CLOSED` status

### Error Responses
- RFQ not found


---

## Activity Log Types

### BID_SUBMITTED
Created whenever a supplier submits a bid.

### TIME_EXTENDED
Created whenever the auction close time is extended.

### AUCTION_CLOSED
Created when auction is manually closed.


---

## Auction Status Values

### ACTIVE
Auction is currently open for bidding.
### CLOSED
Auction close time has passed.
### FORCE_CLOSED
Forced bid close time has passed. No further extensions or bids are allowed.