import React from "react";
import { GetTitle } from "../../util/stringManipulation.tsx";
import { FormatIconImg, FormatIconLink } from "../../util/FormatIconImg.ts";

export interface SpecObj {
  name: string;
  className: string;
  icon: string;
}

const SpecDisplay: React.FC<{ specObj: SpecObj }> = ({ specObj }) => (
  <div className="spec">
    <img
      src={FormatIconImg(specObj.icon)}
      alt={GetTitle(`${specObj.name} ${specObj.className}`)}
      className="spec_icon"
      style={{
        borderRadius: "8px",
        objectFit: "cover",
        border: "1px solid #575757",
      }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = FormatIconLink(specObj.icon);
      }}
    />
    {GetTitle(specObj.name)}
  </div>
);

export default SpecDisplay;