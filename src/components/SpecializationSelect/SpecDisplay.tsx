import React from "react";
import { GetTitle } from "@util/stringManipulation";
import { FormatIconImg, FormatIconLink } from "@util/FormatIconImg";
import { specialization } from "@data/class";
import "./SpecializationSelect.css";

const SpecDisplay: React.FC<{ spec: specialization, short?: boolean }> = ({ spec, short }) => (
  <div className="spec">
    <div
      style={{
        width: "24px",
        height: "24px",
        overflow: "hidden",
        borderRadius: "5px",
        border: "1px solid #575757",
        position: "relative",
        marginRight: "5px",
        flexShrink: 0,
      }}
    >
      <img
        src={FormatIconImg(spec.icon)}
        alt={GetTitle(`${spec.name}`)}
        className="spec_icon"
        style={{
          width: "calc(100% + 4px)",
          height: "calc(100% + 4px)",
          objectFit: "cover",
          display: "block",
          position: "absolute",
          top: "-2px",
          left: "-2px",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FormatIconLink(spec.icon);
        }}
      />
    </div>
    {!short && (
      <>
        {GetTitle(spec.name)}
      </>
    )}
  </div>
);

export default SpecDisplay;