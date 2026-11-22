export type CustomerType = "household" | "business" | "supported";
export type MeterType = "single" | "two" | "three";
export type BusinessCategory = "industrial" | "telecom" | "budget" | "other";

export interface ElectricityTariffInput {
  month: string;
  customerType: CustomerType;
  businessCategory: BusinessCategory;
  meterType: MeterType;
  monthlyKwh: number;
  dayKwh: number;
  eveningKwh: number;
  nightKwh: number;
  includeBaseFee: boolean;
}

export interface ElectricityTariffResult {
  energyCharge: number;
  baseFee: number;
  total: number;
  bandLabel: string;
  rateDetails: { label: string; kwh: number; rate: number; amount: number }[];
  notes: string[];
}

const householdBands = [
  { max: 150, label: "150 кВт.ц хүртэл", single: 184, twoDay: 191, twoNight: 154, threeDay: 179, threeEvening: 294, threeNight: 119 },
  { max: 300, label: "150–300 кВт.ц", single: 269, twoDay: 236, twoNight: 168, threeDay: 200, threeEvening: 305, threeNight: 119 },
  { max: Infinity, label: "300 кВт.ц-аас дээш", single: 299, twoDay: 278, twoNight: 168, threeDay: 231, threeEvening: 315, threeNight: 119 },
];

const businessRates: Record<BusinessCategory, { label: string; single: number; day: number; evening: number; night: number }> = {
  industrial: { label: "Уул уурхай, олборлох болон боловсруулах үйлдвэрлэл", single: 328, day: 328, evening: 547, night: 184 },
  telecom: { label: "Үүрэн холбооны үйлчилгээ", single: 289, day: 289, evening: 459, night: 168 },
  budget: { label: "Төсвийн байгууллага", single: 292, day: 292, evening: 437, night: 176 },
  other: { label: "Бусад үйлдвэр, аж ахуйн нэгж", single: 278, day: 278, evening: 417, night: 168 },
};

export function calculateElectricityTariff(input: ElectricityTariffInput): ElectricityTariffResult {
  const totalKwh = input.meterType === "single" ? input.monthlyKwh : input.dayKwh + input.eveningKwh + input.nightKwh;
  const band = householdBands.find((item) => totalKwh <= item.max) ?? householdBands[2];
  const details: ElectricityTariffResult["rateDetails"] = [];
  const notes = ["Тарифын үнэд 13.48 төг/кВт.ц дэмжих тариф багтсан.", "НӨАТ ороогүй дүн."];
  let baseFee = 0;

  if (input.customerType === "supported") {
    const rate = totalKwh <= 100 ? 90 : 110;
    details.push({ label: "Нийгмийн халамжийн дэмжлэгтэй хэрэглэгч", kwh: totalKwh, rate, amount: totalKwh * rate });
  } else if (input.customerType === "business") {
    const rates = businessRates[input.businessCategory];
    if (input.meterType === "single") {
      details.push({ label: "Энгийн тоолуур", kwh: totalKwh, rate: rates.single, amount: totalKwh * rates.single });
    } else {
      details.push({ label: "Өдрийн хэрэглээ · 06:00–17:00", kwh: input.dayKwh, rate: rates.day, amount: input.dayKwh * rates.day });
      details.push({ label: "Оройн хэрэглээ · 17:00–22:00", kwh: input.eveningKwh, rate: rates.evening, amount: input.eveningKwh * rates.evening });
      details.push({ label: "Шөнийн хэрэглээ · 22:00–06:00", kwh: input.nightKwh, rate: rates.night, amount: input.nightKwh * rates.night });
    }
    notes.unshift(`Сонгосон ангилал: ${rates.label}.`);
  } else {
    if (input.meterType === "single") {
      details.push({ label: "Энгийн тоолуур", kwh: totalKwh, rate: band.single, amount: totalKwh * band.single });
    } else if (input.meterType === "two") {
      details.push({ label: "Өдрийн хэрэглээ · 06:00–21:00", kwh: input.dayKwh, rate: band.twoDay, amount: input.dayKwh * band.twoDay });
      details.push({ label: "Орой, шөнийн хэрэглээ · 21:00–06:00", kwh: input.nightKwh, rate: band.twoNight, amount: input.nightKwh * band.twoNight });
    } else {
      details.push({ label: "Өдрийн хэрэглээ · 06:00–17:00", kwh: input.dayKwh, rate: band.threeDay, amount: input.dayKwh * band.threeDay });
      details.push({ label: "Оройн хэрэглээ · 17:00–21:00", kwh: input.eveningKwh, rate: band.threeEvening, amount: input.eveningKwh * band.threeEvening });
      details.push({ label: "Шөнийн хэрэглээ · 21:00–06:00", kwh: input.nightKwh, rate: band.threeNight, amount: input.nightKwh * band.threeNight });
      notes.push("3 тарифт тоолуурын сарын суурь тарифыг тусад нь сонгон тооцно.");
    }
    notes.unshift(`Сарын хэрэглээний тарифын шатлал: ${band.label}.`);
    if (input.includeBaseFee) baseFee = 3360;
  }

  const energyCharge = details.reduce((sum, row) => sum + row.amount, 0);
  return { energyCharge, baseFee, total: energyCharge + baseFee, bandLabel: input.customerType === "household" ? band.label : "Сонгосон тариф", rateDetails: details, notes };
}
