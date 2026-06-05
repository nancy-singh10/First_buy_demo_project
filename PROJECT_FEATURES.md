# FirstBuy: Section-Wise Feature Documentation

This document outlines the features of the FirstBuy platform, categorized by user roles and platform sections.

## 1. Public Facing Features (Unauthenticated Users)
* **Landing Page (Hero & Stats)**: Engaging introduction to the platform's value proposition with key statistics.
* **How It Works**: Educational section explaining the core concept of scanning receipts, earning credits, and applying them towards property discounts.
* **Capabilities & Rewards Information**: Details on the tier system (Bronze, Silver, Gold, Platinum) and the benefits associated with each.
* **Marketplace Preview**: A sneak peek into the available property listings to entice new users to join.
* **Public Reviews & Testimonials**: Showcasing feedback from existing users.
* **FAQ & Contact Us**: Support sections to address common queries and allow users to reach out to the platform administration.
* **User Authentication (Sign Up / Sign In)**: Secure registration and login flows, supporting different roles (User, Builder).

## 2. Home Buyer (User) Features
* **Personalized Dashboard**: A central hub summarizing the user's progress, including current tier and total credits.
* **Receipt Uploading (`ReceiptUpload`)**: The core earning mechanism. Users can take pictures of their everyday shopping receipts and submit them for review to earn "Property Credits".
* **Wallet & Ledger (`WalletView`)**: A detailed transaction history showing all credits earned (via approved receipts) and spent.
* **Property Marketplace**: Browse, search, and filter real estate listings based on location, price, and the maximum allowable credit discount.
* **Wishlist / Saved Homes (`SavedHomes`)**: Users can bookmark specific properties they are interested in monitoring or purchasing later.
* **Credit Redemption (`RedeemSection`)**: When initiating a property booking, users can apply their accumulated credits to secure a real-money discount on the listed price.
* **Profile Settings (`ProfileSettings`)**: Manage personal details, avatars, and contact information.
* **Property Reviews**: Leave ratings and reviews on properties or builders they have interacted with.

## 3. Builder / Seller Features
* **Builder Dashboard (`BuilderDashboardView`)**: A specialized view for real estate developers to manage their portfolio.
* **Property Listing Management (`AddProperty`)**: Builders can create and edit new property listings, uploading high-quality images, setting prices, and defining locations.
* **Discount Configuration**: Crucially, builders can set a `max_credit_discount_allowed` on each property, controlling the financial exposure while utilizing the platform's promotional model.
* **Lead Tracking**: View which users have requested to book properties or redeem credits against their specific listings.
* **Builder Rewards (`BuilderRewards`)**: Potential incentive structures or visibility boosts for highly-rated builders.
* **Trust Score Tracking**: Builders maintain a public-facing Trust Score that can be influenced by successful handovers and positive buyer reviews.

## 4. Admin / Platform Manager Features
* **Admin Dashboard (`AdminDashboardView`)**: High-level overview of platform activity, user growth, and credit economics.
* **Receipt Verification Queue (`AdminQueue`)**: The critical operational task. Admins review uploaded receipts to verify store names, amounts, and authenticity before approving (minting credits) or rejecting them.
* **Redemption Approval**: Reviewing and finalizing user requests to apply credits to property purchases, ensuring coordination between the buyer and the builder.
* **User & Role Management**: Overseeing registered accounts, managing account statuses, and manually adjusting roles if necessary.
* **Credit Oversight**: Access to the global credit ledger to monitor inflation, track all transactions, and issue bonus credits for promotional campaigns.
* **Content Moderation**: Ensuring property listings meet platform standards and moderating user reviews to maintain a healthy ecosystem.
* **Inquiry Management**: Reviewing and responding to user messages submitted through the Contact Us form.

## 5. Technical Background Services
* **Notification System**: Automated alerts to keep users informed about receipt approval statuses, redemption updates, or platform announcements.
* **Role-Based Access Control (RBAC)**: Securely restricting dashboard views and API endpoints based on the authenticated user's role (User, Builder, Admin).

## 6. Business Model
FirstBuy operates as a multi-sided marketplace bridging retail consumers and real estate developers. The core business model relies on incentivized customer acquisition and data-driven lead generation.

* **For the User (Value Proposition)**: Users turn their everyday retail spending into meaningful discounts for a future home purchase. This gamifies saving and lowers the barrier to entry for real estate investment.
* **For the Builder (Customer Acquisition)**: Builders gain access to a pool of highly engaged, financially motivated prospective buyers. The platform acts as a powerful, targeted marketing channel. Builders offer a conditional discount (the `max_credit_discount_allowed`) in exchange for guaranteed leads and eventual sales.
* **Potential Revenue Streams (Monetization)**:
    1. **Commission / Lead Fees**: Charging builders a flat fee per qualified lead or a percentage commission on successful property bookings facilitated through the platform.
    2. **Builder Subscriptions**: Offering premium tiers for developers to feature their listings prominently, access advanced market analytics, or increase their allowed discount caps.
    3. **Data Monetization**: Aggregating and anonymizing consumer spending habits from the uploaded receipts to provide valuable market research and retail trends to third parties.
    4. **Retail Partnerships**: Partnering with specific retail brands (e.g., supermarkets, electronics stores) to offer "multiplier" credits when users shop at their stores, paid for by the retail brands as targeted advertising.

## 7. Tier System & Rewards
The platform utilizes a tier-based progression system to incentivize active participation for both Home Buyers and Builders.

### 7.1 Home Buyer (User) Tiers
Users progress through tiers by accumulating lifetime credits or subscribing to premium tiers.
* **Bronze (Default)**: 
  * Earning Rate: 1x credit multiplier (1 Rupee spent = 1 Credit).
  * Perks: Basic insights.
* **Silver**: 
  * Requirement: Unlocks automatically after earning 50,000 credits.
  * Earning Rate: 1.25x credit multiplier.
  * Perks: Priority OCR receipt processing.
* **Gold**: 
  * Requirement: Paid Subscription.
  * Earning Rate: 1.5x credit multiplier.
  * Perks: Concierge support.
* **Platinum**:
  * Requirement: Paid Subscription.
  * Earning Rate: 2x credit multiplier.
  * Perks: Builder pre-launch access (early access to new property listings).

### 7.2 Builder Tiers
Builders progress through tiers based on the number of successful property bookings facilitated through the platform. Higher tiers reduce platform fees and boost listing visibility.
* **Bronze Builder (Default, 0 Bookings)**:
  * Platform Fee: Standard (5%).
  * Visibility: Basic marketplace visibility.
* **Silver Builder (2+ Bookings)**:
  * Platform Fee: Reduced (4%).
  * Visibility: "Verified" badge on property listings.
* **Gold Builder (10+ Bookings)**:
  * Platform Fee: Reduced (2.5%).
  * Visibility: Priority search placement and "Featured" tags on properties.
* **Platinum Builder (25+ Bookings)**:
  * Platform Fee: 0% fee.
  * Visibility: Top marketplace visibility and access to a dedicated account manager.

## 8. Future Features & Potential Integrations
To scale the platform and enhance the user experience, the following features can be integrated in future phases:

### 8.1 Advanced Technology & Automation
* **AI-Powered OCR for Receipts**: Integrate AWS Textract, Google Cloud Vision, or a custom ML model to automatically parse `store_name`, `amount`, and `date` from uploaded receipts. This minimizes the manual admin verification queue and provides instant credit gratification to users.
* **Open Banking / Plaid Integration**: Allow users to securely link their bank accounts or credit cards. The platform can automatically detect eligible purchases and award credits passively, eliminating the need to take photos of receipts entirely.

### 8.2 Real Estate & Buying Experience
* **Interactive Map & Geo-Location**: Implement a map-based UI (Google Maps or Mapbox) for discovering properties. Users can get push notifications if they are physically near a partnered property or a retail store offering "multiplier" credits.
* **Virtual Tours (AR/VR)**: Integrate Matterport or 3D panoramas into property listings so users can virtually walk through a home before booking.
* **In-App Chat System**: Secure, real-time messaging between prospective buyers and builders to negotiate terms, ask questions, or schedule site visits.
* **Integrated Mortgage Calculator & Financing**: Partner with banks or lenders to offer mortgage pre-approvals directly within the app, factoring in the user's earned credits as part of their down payment.

### 8.3 Gamification & Ecosystem Growth
* **Referral & Affiliate Program**: Award bonus credits to users who successfully invite friends or family to join the platform.
* **Secondary Market for Credits**: Allow users who change their minds about buying a home to securely transfer or sell their earned credits to other users (with a platform transfer fee).
* **Retailer "Missions"**: Partnered brands can sponsor specific campaigns (e.g., "Spend ₹5,000 at SuperMart this month for a 500-credit bonus").
