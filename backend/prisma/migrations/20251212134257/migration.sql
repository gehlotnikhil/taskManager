-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiryOfOtp" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpCode" TEXT;
