import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  MapPinOff,
} from "lucide-react";
import styles from "./LocationDateTime.module.css";

type LocationDateTimeProps = {
  location?: string;
  timeZoneName?: string;
};

const getOrdinal = (day: number) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const LocationDateTime = ({
  location,
  timeZoneName = "GMT",
}: LocationDateTimeProps) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const day = now.getDate();

  const month = new Intl.DateTimeFormat("en", {
    month: "long",
  }).format(now);

  const year = now.getFullYear();

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const hasLocation = Boolean(location?.trim());

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <CalendarDays
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <span>
          {day}
          {getOrdinal(day)} {month} {year}
        </span>
      </div>

      <span className={styles.separator} aria-hidden="true">
        ·
      </span>

      <div className={styles.time}>
        <Clock3
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <time>{time}</time>

        <span className={styles.timeZone}>
          ({timeZoneName})
        </span>
      </div>

      <span className={styles.separator} aria-hidden="true">
        ·
      </span>

      <div
        className={`${styles.location} ${
          !hasLocation ? styles.noLocation : ""
        }`}
        title={hasLocation ? location : "Location unavailable"}
      >
        {hasLocation ? (
          <MapPin
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        ) : (
          <MapPinOff
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}

        {hasLocation && <span>{location}</span>}
      </div>
    </div>
  );
};

export default LocationDateTime;