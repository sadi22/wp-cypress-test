import React from "react";
import { useGlobalStore } from "../hooks/useGlobalStore";
import DashboardCard from "./DashboardCard";
import ContactProfile from "./Icons/ContactProfile";
import Pending from "./Icons/Pending";
import Subscribe from "./Icons/Subscribe";
import Unsubscribe from "./Icons/Unsubscribe";

const Dashboard = () => {
  useGlobalStore.setState({
    hideGlobalNav: true,
  });
  return (
    <div className="contact-list-page">
      <div className="mintmrm-container">
        <h2 class="conatct-heading">Dashboard</h2>
        <div className="contact-info-wrapper">
          <DashboardCard
            url="/contacts"
            source={<ContactProfile />}
            cardTitle="Contacts"
          />
          <DashboardCard url="/tags" source={<Subscribe />} cardTitle="Tags" />
          <DashboardCard
            url="/lists"
            source={<Unsubscribe />}
            cardTitle="Lists"
          />
          <DashboardCard
            url="/campaigns"
            source={<Pending />}
            cardTitle="Campaigns"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
