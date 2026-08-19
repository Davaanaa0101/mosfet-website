import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";
import Alert, {
  AlertType,
} from "@/models/Alert";

// =====================================================
// ALERT THRESHOLDS
// =====================================================

const ALERT_THRESHOLDS = {
  highTemperature: 30,
  lowTemperature: 0,

  highHumidity: 80,
  lowHumidity: 20,

  highCurrent: 10,

  lowRssi: -80,
};

// =====================================================
// ALERT TYPES
// =====================================================

const ALERT_TYPES = [
  "DEVICE_OFFLINE",
  "HIGH_TEMPERATURE",
  "LOW_TEMPERATURE",
  "HIGH_HUMIDITY",
  "LOW_HUMIDITY",
  "HIGH_CURRENT",
  "LOW_RSSI",
] as const;

function isAlertType(
  value: string
): value is AlertType {
  return ALERT_TYPES.includes(
    value as AlertType
  );
}

// =====================================================
// TYPES
// =====================================================

interface IncomingSensor {
  slot: number;
  type: string;
  value?: number | null;
}

interface SensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

// =====================================================
// POST TELEMETRY
// =====================================================

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      deviceId,
      name,
      type,
      location,
      macAddress,
      firmware,
      ipAddress,
      wifiSSID,

      temperature,
      humidity,
      voltage,
      current,
      power,
      energy,

      rssi,
      freeHeap,
      uptime,

      sensors,
    } = body;

    // =================================================
    // VALIDATE DEVICE ID
    // =================================================

    if (
      !deviceId ||
      typeof deviceId !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceId is required",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedDeviceId =
      deviceId.trim();

    if (
      !normalizedDeviceId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceId cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // NORMALIZE DEVICE TYPE
    // =================================================

    const deviceTypes = [
      "esp32",
      "plc",
      "modbus",
      "camera",
    ] as const;

    type DeviceType =
      (typeof deviceTypes)[number];

    const normalizedType: DeviceType =
      typeof type === "string" &&
      deviceTypes.includes(
        type
          .trim()
          .toLowerCase() as DeviceType
      )
        ? (type
            .trim()
            .toLowerCase() as DeviceType)
        : "esp32";

    // =================================================
    // FIND DEVICE
    // =================================================

    let device =
      await Device.findOne({
        deviceId:
          normalizedDeviceId,
      });

    // =================================================
    // CREATE DEVICE
    // =================================================

    if (!device) {
      device =
        await Device.create({
          deviceId:
            normalizedDeviceId,

          name:
            typeof name ===
              "string" &&
            name.trim()
              ? name.trim()
              : normalizedDeviceId,

          type:
            normalizedType,

          location:
            typeof location ===
            "string"
              ? location.trim()
              : "",

          macAddress:
            typeof macAddress ===
            "string"
              ? macAddress.trim()
              : "",

          firmware:
            typeof firmware ===
            "string"
              ? firmware.trim()
              : "",

          ipAddress:
            typeof ipAddress ===
            "string"
              ? ipAddress.trim()
              : "",

          status: "online",

          lastSeen:
            new Date(),
        });

      console.log(
        `[telemetry] Registered new device: ${normalizedDeviceId}`
      );
    }

    // =================================================
    // UPDATE DEVICE
    // =================================================

    else {
      device.status =
        "online";

      device.lastSeen =
        new Date();

      if (
        typeof name ===
          "string" &&
        name.trim()
      ) {
        device.name =
          name.trim();
      }

      device.type =
        normalizedType;

      if (
        typeof location ===
          "string" &&
        location.trim()
      ) {
        device.location =
          location.trim();
      }

      if (
        typeof macAddress ===
          "string" &&
        macAddress.trim()
      ) {
        device.macAddress =
          macAddress.trim();
      }

      if (
        typeof firmware ===
          "string" &&
        firmware.trim()
      ) {
        device.firmware =
          firmware.trim();
      }

      if (
        typeof ipAddress ===
          "string" &&
        ipAddress.trim()
      ) {
        device.ipAddress =
          ipAddress.trim();
      }

      await device.save();
    }

    // =================================================
    // NORMALIZE SENSOR ARRAY
    // =================================================

    const normalizedSensors: IncomingSensor[] =
      Array.isArray(sensors)
        ? sensors
            .filter(
              (sensor) =>
                sensor &&
                typeof sensor.slot ===
                  "number" &&
                typeof sensor.type ===
                  "string"
            )
            .map(
              (sensor) => ({
                slot: sensor.slot,

                type:
                  sensor.type,

                value:
                  typeof sensor.value ===
                  "number"
                    ? sensor.value
                    : null,
              })
            )
        : [];

    // =================================================
    // SAVE TELEMETRY
    // =================================================

    const telemetry =
      await DeviceLog.create({
        deviceId:
          normalizedDeviceId,

        temperature:
          typeof temperature ===
          "number"
            ? temperature
            : undefined,

        humidity:
          typeof humidity ===
          "number"
            ? humidity
            : undefined,

        voltage:
          typeof voltage ===
          "number"
            ? voltage
            : undefined,

        current:
          typeof current ===
          "number"
            ? current
            : undefined,

        power:
          typeof power ===
          "number"
            ? power
            : undefined,

        energy:
          typeof energy ===
          "number"
            ? energy
            : undefined,

        wifiSSID:
          typeof wifiSSID ===
          "string"
            ? wifiSSID
            : undefined,

        ipAddress:
          typeof ipAddress ===
          "string"
            ? ipAddress
            : undefined,

        rssi:
          typeof rssi ===
          "number"
            ? rssi
            : undefined,

        freeHeap:
          typeof freeHeap ===
          "number"
            ? freeHeap
            : undefined,

        uptime:
          typeof uptime ===
          "number"
            ? uptime
            : undefined,

        sensors:
          normalizedSensors,
      });

    // =================================================
    // LOAD SENSOR CONFIGURATION
    // =================================================

    const configuredSensors: SensorConfig[] =
      Array.isArray(
        (device as any).sensors
      )
        ? (device as any).sensors
        : [];

    // =================================================
    // SENSOR NAME HELPER
    // =================================================

    function getSensorName(
      slot: number
    ): string {
      const configured =
        configuredSensors.find(
          (sensor) =>
            sensor.slot ===
            slot
        );

      if (
        configured?.name
      ) {
        return configured.name;
      }

      return `Sensor #${slot}`;
    }

    // =================================================
    // CREATE OR KEEP ACTIVE ALERT
    // =================================================

    async function activateAlert(
      options: {
        type: AlertType;

        title: string;

        message: string;

        severity:
          | "critical"
          | "warning"
          | "info";

        slot?: number;

        sensorType?: string;

        sensorName?: string;

        value?: number;

        threshold?: number;

        unit?: string;
      }
    ) {
      if (
        !isAlertType(
          options.type
        )
      ) {
        return;
      }

      const query: Record<
        string,
        unknown
      > = {
        deviceId:
          normalizedDeviceId,

        type: options.type,

        status: "active",
      };

      if (
        typeof options.slot ===
        "number"
      ) {
        query.slot =
          options.slot;
      }

      const existing =
        await Alert.findOne(
          query
        );

      // Already active
      if (existing) {
        return;
      }

      await Alert.create({
        deviceId:
          normalizedDeviceId,

        deviceName:
          device.name ||
          normalizedDeviceId,

        type:
          options.type,

        title:
          options.title,

        message:
          options.message,

        severity:
          options.severity,

        slot:
          options.slot,

        sensorType:
          options.sensorType,

        sensorName:
          options.sensorName,

        value:
          typeof options.value ===
          "number"
            ? options.value
            : null,

        threshold:
          typeof options.threshold ===
          "number"
            ? options.threshold
            : null,

        unit:
          options.unit || "",

        status: "active",

        triggeredAt:
          new Date(),
      });

      console.log(
        `[alerts] Created ${options.type} for ${normalizedDeviceId}`
      );
    }

    // =================================================
    // RESOLVE ALERT
    // =================================================

    async function resolveAlert(
      type: AlertType,
      slot?: number
    ) {
      const query: Record<
        string,
        unknown
      > = {
        deviceId:
          normalizedDeviceId,

        type,

        status: "active",
      };

      if (
        typeof slot ===
        "number"
      ) {
        query.slot = slot;
      }

      const activeAlert =
        await Alert.findOne(
          query
        );

      if (!activeAlert) {
        return;
      }

      activeAlert.status =
        "resolved";

      activeAlert.resolvedAt =
        new Date();

      await activeAlert.save();

      console.log(
        `[alerts] Resolved ${type} for ${normalizedDeviceId}`
      );
    }

    // =================================================
    // CHECK SENSOR VALUES
    // =================================================

    for (const sensor of normalizedSensors) {
      if (
        sensor.value === null ||
        sensor.value ===
          undefined ||
        !Number.isFinite(
          sensor.value
        )
      ) {
        continue;
      }

      const value =
        sensor.value;

      const sensorName =
        getSensorName(
          sensor.slot
        );

      const sensorType =
        sensor.type.toUpperCase();

      // ===============================================
      // TEMPERATURE
      // ===============================================

      if (
        sensorType ===
          "TEMPERATURE" ||
        sensorType ===
          "DHT_TEMPERATURE"
      ) {
        if (
          value >
          ALERT_THRESHOLDS.highTemperature
        ) {
          await activateAlert({
            type:
              "HIGH_TEMPERATURE",

            title:
              "High Temperature",

            message:
              `${sensorName} temperature is ${value.toFixed(
                2
              )} °C`,

            severity:
              "critical",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              ALERT_THRESHOLDS.highTemperature,

            unit: "°C",
          });
        } else {
          await resolveAlert(
            "HIGH_TEMPERATURE",
            sensor.slot
          );
        }

        if (
          value <
          ALERT_THRESHOLDS.lowTemperature
        ) {
          await activateAlert({
            type:
              "LOW_TEMPERATURE",

            title:
              "Low Temperature",

            message:
              `${sensorName} temperature is ${value.toFixed(
                2
              )} °C`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              ALERT_THRESHOLDS.lowTemperature,

            unit: "°C",
          });
        } else {
          await resolveAlert(
            "LOW_TEMPERATURE",
            sensor.slot
          );
        }
      }

      // ===============================================
      // HUMIDITY
      // ===============================================

      if (
        sensorType ===
        "DHT_HUMIDITY"
      ) {
        if (
          value >
          ALERT_THRESHOLDS.highHumidity
        ) {
          await activateAlert({
            type:
              "HIGH_HUMIDITY",

            title:
              "High Humidity",

            message:
              `${sensorName} humidity is ${value.toFixed(
                2
              )}%`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              ALERT_THRESHOLDS.highHumidity,

            unit: "%",
          });
        } else {
          await resolveAlert(
            "HIGH_HUMIDITY",
            sensor.slot
          );
        }

        if (
          value <
          ALERT_THRESHOLDS.lowHumidity
        ) {
          await activateAlert({
            type:
              "LOW_HUMIDITY",

            title:
              "Low Humidity",

            message:
              `${sensorName} humidity is ${value.toFixed(
                2
              )}%`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              ALERT_THRESHOLDS.lowHumidity,

            unit: "%",
          });
        } else {
          await resolveAlert(
            "LOW_HUMIDITY",
            sensor.slot
          );
        }
      }
    }

    // =================================================
    // LEGACY / DEVICE CURRENT
    // =================================================

    if (
      typeof current ===
      "number" &&
      Number.isFinite(
        current
      )
    ) {
      if (
        Math.abs(current) >
        ALERT_THRESHOLDS.highCurrent
      ) {
        await activateAlert({
          type:
            "HIGH_CURRENT",

          title:
            "High Current",

          message:
            `Device current is ${current.toFixed(
              2
            )} A`,

          severity:
            "critical",

          value:
            current,

          threshold:
            ALERT_THRESHOLDS.highCurrent,

          unit: "A",
        });
      } else {
        await resolveAlert(
          "HIGH_CURRENT"
        );
      }
    }

    // =================================================
    // RSSI
    // =================================================

    if (
      typeof rssi ===
      "number" &&
      Number.isFinite(
        rssi
      )
    ) {
      if (
        rssi <
        ALERT_THRESHOLDS.lowRssi
      ) {
        await activateAlert({
          type:
            "LOW_RSSI",

          title:
            "Weak Wi-Fi Signal",

          message:
            `Wi-Fi signal is ${rssi} dBm`,

          severity:
            "warning",

          value:
            rssi,

          threshold:
            ALERT_THRESHOLDS.lowRssi,

          unit: "dBm",
        });
      } else {
        await resolveAlert(
          "LOW_RSSI"
        );
      }
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Telemetry received",

      deviceId:
        normalizedDeviceId,

      sensorCount:
        normalizedSensors.length,

      timestamp:
        new Date().toISOString(),

      telemetryId:
        String(
          telemetry._id
        ),
    });
  } catch (error) {
    console.error(
      "[telemetry] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}