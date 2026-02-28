-- CreateTable
CREATE TABLE "petAddress" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "petAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "petAddress_petId_key" ON "petAddress"("petId");

-- AddForeignKey
ALTER TABLE "petAddress" ADD CONSTRAINT "petAddress_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
