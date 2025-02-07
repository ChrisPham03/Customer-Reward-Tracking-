/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin_spa_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `availability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_promotions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `point_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotion_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spa_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin_activities" DROP CONSTRAINT "admin_activities_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_spa_access" DROP CONSTRAINT "admin_spa_access_adminId_fkey";

-- DropForeignKey
ALTER TABLE "admin_spa_access" DROP CONSTRAINT "admin_spa_access_spaId_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_accountId_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_roleId_fkey";

-- DropForeignKey
ALTER TABLE "availability" DROP CONSTRAINT "availability_staffId_fkey";

-- DropForeignKey
ALTER TABLE "booking_services" DROP CONSTRAINT "booking_services_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "booking_services" DROP CONSTRAINT "booking_services_spaServiceId_fkey";

-- DropForeignKey
ALTER TABLE "booking_services" DROP CONSTRAINT "booking_services_staffId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customerId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_spaId_fkey";

-- DropForeignKey
ALTER TABLE "customer_promotions" DROP CONSTRAINT "customer_promotions_customerId_fkey";

-- DropForeignKey
ALTER TABLE "customer_promotions" DROP CONSTRAINT "customer_promotions_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_accountId_fkey";

-- DropForeignKey
ALTER TABLE "point_balances" DROP CONSTRAINT "point_balances_customerId_fkey";

-- DropForeignKey
ALTER TABLE "point_rules" DROP CONSTRAINT "point_rules_spaId_fkey";

-- DropForeignKey
ALTER TABLE "point_rules" DROP CONSTRAINT "point_rules_spaServiceId_fkey";

-- DropForeignKey
ALTER TABLE "point_transactions" DROP CONSTRAINT "point_transactions_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "point_transactions" DROP CONSTRAINT "point_transactions_customerId_fkey";

-- DropForeignKey
ALTER TABLE "point_transactions" DROP CONSTRAINT "point_transactions_pointRuleId_fkey";

-- DropForeignKey
ALTER TABLE "promotion_services" DROP CONSTRAINT "promotion_services_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "promotion_services" DROP CONSTRAINT "promotion_services_spaServiceId_fkey";

-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_spaId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "spa_services" DROP CONSTRAINT "spa_services_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "spa_services" DROP CONSTRAINT "spa_services_spaId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_accountId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_spaId_fkey";

-- DropForeignKey
ALTER TABLE "staff_services" DROP CONSTRAINT "staff_services_spaServiceId_fkey";

-- DropForeignKey
ALTER TABLE "staff_services" DROP CONSTRAINT "staff_services_staffId_fkey";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "admin_activities";

-- DropTable
DROP TABLE "admin_spa_access";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "availability";

-- DropTable
DROP TABLE "booking_services";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "customer_promotions";

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "point_balances";

-- DropTable
DROP TABLE "point_rules";

-- DropTable
DROP TABLE "point_transactions";

-- DropTable
DROP TABLE "promotion_services";

-- DropTable
DROP TABLE "promotions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "spa_services";

-- DropTable
DROP TABLE "spas";

-- DropTable
DROP TABLE "staff";

-- DropTable
DROP TABLE "staff_services";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthCode" (
    "id" TEXT NOT NULL,
    "userAccountId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "userAccountId" TEXT NOT NULL,
    "loginMethod" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userAccountId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringInterval" TEXT,
    "notes" TEXT,
    "pointsEarned" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "serviceId" TEXT,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minSpend" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionService" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "rewardType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardService" (
    "id" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardClaimed" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "RewardClaimed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRTransaction" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_phoneNumber_key" ON "UserAccount"("phoneNumber");

-- CreateIndex
CREATE INDEX "UserAccount_email_phoneNumber_idx" ON "UserAccount"("email", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userAccountId_key" ON "UserProfile"("userAccountId");

-- CreateIndex
CREATE INDEX "Point_userProfileId_businessId_idx" ON "Point"("userProfileId", "businessId");

-- CreateIndex
CREATE INDEX "Point_serviceId_idx" ON "Point"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionService_promotionId_serviceId_key" ON "PromotionService"("promotionId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardService_rewardId_serviceId_key" ON "RewardService"("rewardId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "QRTransaction_qrCode_key" ON "QRTransaction"("qrCode");

-- AddForeignKey
ALTER TABLE "AuthCode" ADD CONSTRAINT "AuthCode_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionService" ADD CONSTRAINT "PromotionService_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionService" ADD CONSTRAINT "PromotionService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardService" ADD CONSTRAINT "RewardService_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardService" ADD CONSTRAINT "RewardService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardClaimed" ADD CONSTRAINT "RewardClaimed_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardClaimed" ADD CONSTRAINT "RewardClaimed_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRTransaction" ADD CONSTRAINT "QRTransaction_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
