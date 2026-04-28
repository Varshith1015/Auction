# Database Schema - British Auction RFQ System

## Tables

1. rfqs
2. auction_configs
3. bids
4. auction_activity_logs


## 1. rfqs

Purpose:
Stores main RFQ and auction timing details.

Columns:
- id: Primary key
- rfq_name: Name of the RFQ
- reference_id: Unique RFQ reference
- bid_start_time: Auction start date and time
- bid_close_time: Current auction close date and time
- forced_bid_close_time: Final hard stop time
- pickup_service_date: Pickup or service date
- status: ACTIVE, CLOSED, FORCE_CLOSED
- created_at: Record created time



## 2. auction_configs

Purpose:
Stores British Auction behavior settings.

Columns:
- id: Primary key
- rfq_id: Foreign key to rfqs
- trigger_window_minutes: X minutes before close time
- extension_duration_minutes: Y minutes to extend
- extension_trigger_type: BID_RECEIVED / ANY_RANK_CHANGE / L1_CHANGE


## 3. bids

Purpose:
Stores all supplier bids for an RFQ.

Columns:
- id: Primary key
- rfq_id: Foreign key to rfqs
- supplier_name: Supplier name
- freight_charges: Freight cost
- origin_charges: Origin charges
- destination_charges: Destination charges
- total_amount: Total bid amount (calculated)
- transit_time: Delivery time
- quote_validity: Validity of quote
- created_at: Bid submission time


## 4. auction_activity_logs

Purpose:
Tracks all important auction events.

Columns:
- id: Primary key
- rfq_id: Foreign key to rfqs
- activity_type: BID_SUBMITTED / TIME_EXTENDED / AUCTION_CLOSED
- message: Description of activity
- old_bid_close_time: Previous close time (if extended)
- new_bid_close_time: Updated close time
- created_at: Activity timestamp