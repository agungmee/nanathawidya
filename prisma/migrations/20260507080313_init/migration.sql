/*
  Warnings:

  - You are about to drop the column `areaId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `biteshipOrderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cancelReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `courierName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `courierService` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `dimension` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `reviewRequestedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `snapToken` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `waybillUrl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `weightGrams` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `variation` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `actionType` on the `OrderLog` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isPreorder` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `popularCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `preorderDays` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `soldCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `videoFile` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Voucher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "areaId";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "video",
ADD COLUMN     "subtitle" TEXT;

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "biteshipOrderId",
DROP COLUMN "cancelReason",
DROP COLUMN "completedAt",
DROP COLUMN "courierName",
DROP COLUMN "courierService",
DROP COLUMN "dimension",
DROP COLUMN "discountAmount",
DROP COLUMN "expiredAt",
DROP COLUMN "paidAt",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
DROP COLUMN "reviewRequestedAt",
DROP COLUMN "shippedAt",
DROP COLUMN "shippingAddress",
DROP COLUMN "shippingFee",
DROP COLUMN "snapToken",
DROP COLUMN "trackingNumber",
DROP COLUMN "waybillUrl",
DROP COLUMN "weightGrams",
ADD COLUMN     "whatsappSent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "variantId",
DROP COLUMN "variation";

-- AlterTable
ALTER TABLE "OrderLog" DROP COLUMN "actionType";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "height",
DROP COLUMN "isPreorder",
DROP COLUMN "length",
DROP COLUMN "popularCount",
DROP COLUMN "preorderDays",
DROP COLUMN "soldCount",
DROP COLUMN "stock",
DROP COLUMN "videoFile",
DROP COLUMN "videoUrl",
DROP COLUMN "weight",
DROP COLUMN "width";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dob",
DROP COLUMN "gender",
DROP COLUMN "googleId",
DROP COLUMN "googleRefreshToken",
DROP COLUMN "googleToken";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Voucher";

-- DropTable
DROP TABLE "Wishlist";
