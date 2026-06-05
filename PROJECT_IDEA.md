# FirstBuy: Project Idea & Role Sections

## 1. Core Project Idea
**FirstBuy** is an innovative prop-tech (property technology) platform designed to make real estate more accessible by bridging daily spending with property investments. 

**The Concept:** Users earn "Property Credits" by uploading their everyday shopping receipts to the platform. Over time, these credits accumulate based on their spending. When a user is ready to buy a home, they can redeem their accumulated credits as a direct, real-money discount on properties listed by partnered builders. 

---

## 2. User Section (Home Buyers)
This section is tailored for everyday users who are looking to save up and eventually purchase a property.

**Key Features & Workflows:**
*   **Receipt Uploading & Earnings:** Users can take photos of their daily shopping receipts and upload them. Once approved, a percentage of the receipt value is credited to their account as Property Credits.
*   **Tier System & Rewards:** Users progress through loyalty tiers (Bronze, Silver, Gold, Platinum) based on their activity, unlocking higher earning rates or exclusive property deals.
*   **Dashboard & Wallet:** A personalized dashboard where users can track their total credit balance, view the status of their uploaded receipts (Pending/Approved/Rejected), and see their transaction history.
*   **Property Discovery:** Users can browse, search, and filter real estate listings based on location, price, and the maximum credit discount allowed.
*   **Wishlist:** Users can save or bookmark properties they are interested in for future reference.
*   **Credit Redemption:** When booking a property, users can apply their earned credits to receive a discount on the final price.
*   **Reviews & Ratings:** Users can leave feedback and rate properties they have interacted with or visited.

---

## 3. Builder Section (Property Developers / Sellers)
This section is designed for real estate developers, builders, and owners who want to list their properties and attract buyers through the platform's unique discount model.

**Key Features & Workflows:**
*   **Property Listing Management:** Builders can create new property listings, providing details such as title, description, price, location, and property status (Available vs. Booked).
*   **Discount Configuration:** Builders can set a `max_credit_discount_allowed` for each property, controlling the maximum amount of FirstBuy credits a user can apply to that specific home.
*   **Media Management:** Builders can upload and manage multiple high-quality images for their property listings.
*   **Lead & Booking Tracking:** Builders can view which users have requested to book their property or redeem credits against their listings.
*   **Trust Score Management:** Builders maintain a "Trust Score" visible to users, which can be influenced by successful handovers and positive user reviews.

---

## 4. Admin Section (Platform Managers)
This section is for the platform operators who oversee the ecosystem, ensuring quality control and fraud prevention.

**Key Features & Workflows:**
*   **Receipt Verification (Core Task):** Admins review the receipts uploaded by users. They verify the store, the amount spent, and ensure the receipt is genuine before approving it (which mints credits to the user) or rejecting it.
*   **Redemption Approval:** When a user applies credits to buy a property, admins review and approve the redemption request to finalize the transaction between the user and the builder.
*   **User & Role Management:** Admins can view all registered accounts, upgrade user roles (e.g., verifying a user as a legitimate "Builder"), and manage account statuses.
*   **Credit Oversight:** Admins have access to the global credit ledger, allowing them to monitor inflation, track all credit transactions, and manually issue "Bonus" credits to users for promotions.
*   **Content Moderation:** Admins can oversee property listings to ensure they meet platform standards and moderate user reviews to prevent spam.
