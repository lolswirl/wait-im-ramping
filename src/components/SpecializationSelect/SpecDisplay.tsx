import React from "react";
import { GetTitle } from "../../util/stringManipulation.tsx";
import { FormatIconImg, FormatIconLink } from "../../util/FormatIconImg.ts";
import { specialization } from "../../data/class/class.ts";

const SpecDisplay: React.FC<{ spec: specialization, short?: boolean }> = ({ spec, short }) => (
  <div className="spec">
    <img
      src={FormatIconImg(spec.icon)}
      alt={GetTitle(`${spec.name}`)}
      className="spec_icon"
      style={{
        borderRadius: "8px",
        objectFit: "cover",
        border: "1px solid #575757",
      }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = FormatIconLink(spec.icon);
      }}
    />
    {!short && (
      <>
        {GetTitle(spec.name)}
      </>
    )}
  </div>
);

export default SpecDisplay;