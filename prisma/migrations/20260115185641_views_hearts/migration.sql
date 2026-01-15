-- CreateTable
CREATE TABLE "validateView" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "viewDate" DATE NOT NULL,

    CONSTRAINT "validateView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validadeHeart" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "validadeHeart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "validateView_petId_userId_idx" ON "validateView"("petId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "validateView_petId_userId_viewDate_key" ON "validateView"("petId", "userId", "viewDate");

-- CreateIndex
CREATE INDEX "validadeHeart_petId_userId_idx" ON "validadeHeart"("petId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "validadeHeart_petId_userId_key" ON "validadeHeart"("petId", "userId");

-- AddForeignKey
ALTER TABLE "validateView" ADD CONSTRAINT "validateView_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validateView" ADD CONSTRAINT "validateView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validadeHeart" ADD CONSTRAINT "validadeHeart_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validadeHeart" ADD CONSTRAINT "validadeHeart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
