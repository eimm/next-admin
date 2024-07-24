import React, { FC } from "react";
import Billboards from "./Billboards";

const BillboardsPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 space-y-4 pt-6">
        <Billboards />
      </div>
    </div>
  );
};

export default BillboardsPage;
