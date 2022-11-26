import create from "zustand";


export const useGlobalStore = create((set) => ({
  triggerStep: {
    triggerCondition: "true",
    triggerOption: {},
  },
  condition: [
    {
      key: "country",
      comparison: "includes",
      value: "dhaka",
    },
    [
      {
        key: "country",
        comparison: "includes",
        value: "dhaka",
      },
    ],
    {},
  ],
  delay: "",
  sendEmail: "",
  lastStepNodeID: 0,
  navbarMarkup: <></>,
  hideGlobalNav: false,
  hideAllCustomSelect: false,
  activeCustomSelect: null,
  counterRefresh: false
}));
