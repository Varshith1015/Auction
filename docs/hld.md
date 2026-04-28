# HLD - British Auction RFQ System

## 1. Overview
This system allows a buyer to create an RFQ with British Auction enabled. Suppliers can submit bids during the auction period. If bidding activity happens near the auction close time, the system can automatically extend the close time based on configured rules. However, the auction can never extend beyond the forced bid close time.

## 2. Main Modules
1. RFQ Management
Allows buyer to create and view RFQs with auction timing details.

2. Auction Configuration
Stores trigger window, extension duration, and extension trigger type.

3. Bid Submission
Allows suppliers to submit quote details and prices.

4. Auction Extension Engine
Checks whether a bid should extend the auction close time.

5. Ranking Engine
Sorts supplier bids by total amount and assigns L1, L2, L3 ranking.

6. Activity Log
Tracks bid submissions, time extensions, and reasons for extensions.

## 3. Architecture Flow
1. Buyer creates RFQ → stored in rfqs table
2. Auction configuration stored in auction_configs
3. Supplier submits bid → hits POST /bids API
4. Backend saves bid in bids table
5. Ranking engine recalculates L1, L2, L3
6. Extension engine checks:
   - Is current time within trigger window?
   - Did trigger condition happen?
   - Will new time exceed forced close?
7. If valid → extend bid_close_time
8. Log activity in auction_activity_logs
9. Frontend fetches updated auction details

## 4. Auction Extension Logic
When a supplier submits a bid, the backend checks whether the bid was placed inside the trigger window.

Example:
Bid Close Time = 6:00 PM
Trigger Window = 10 minutes
Extension Duration = 5 minutes

If a bid comes between 5:50 PM and 6:00 PM, the auction may extend to 6:05 PM.

Before extending, system checks:

1. New close time must not cross forced bid close time.
2. Extension should happen only if configured trigger condition is satisfied.
3. Activity log must store the reason for extension.

Supported trigger types:

1. BID_RECEIVED_LAST_X_MINUTES
Extends auction when any bid is submitted in the last X minutes.

2. ANY_SUPPLIER_RANK_CHANGE
Extends auction when supplier ranking changes in the last X minutes.

3. L1_RANK_CHANGE
Extends auction only when the lowest bidder changes.

## 5. Pages Needed
1. RFQ Creation Page
Buyer creates RFQ with auction timings and configuration.

2. Auction Listing Page
Shows all British Auctions with lowest bid, close time, forced close time, and status.

3. Auction Details Page
Shows RFQ details, supplier bids, rankings, auction config, and activity logs.

4. Bid Submission Page/Form
Supplier submits charges, transit time, and quote validity.

## 6. APIs Needed
1. POST /api/rfqs
Create RFQ with auction configuration.

2. GET /api/rfqs
Fetch all auctions for listing page.

3. GET /api/rfqs/:id
Fetch RFQ details, bids, ranking, config, and logs.

4. POST /api/rfqs/:id/bids
Submit supplier bid and run auction extension logic.

5. POST /api/rfqs/:id/close
Close auction.

## 7. Database Tables
1. rfqs
Stores RFQ basic details, auction start time, close time, forced close time, and status.

2. auction_configs
Stores British Auction settings like trigger window, extension duration, and trigger type.

3. bids
Stores supplier quote details and total bid amount.

4. auction_activity_logs
Stores bid submissions, auction extensions, and reason logs.