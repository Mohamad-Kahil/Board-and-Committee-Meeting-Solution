// Meeting types data
export const meetingTypes = [
  "Regular Board Meeting",
  "Annual General Meeting (AGM)",
  "Special (Extraordinary) Meeting",
  "Strategic Planning Meeting",
  "Committee Review Meeting",
];

// Meeting venues data
export const venues = [
  { id: "v1", name: "Main Boardroom", capacity: 20, hasVideoConference: true },
  {
    id: "v2",
    name: "Executive Conference Room",
    capacity: 15,
    hasVideoConference: true,
  },
  { id: "v3", name: "Meeting Room A", capacity: 10, hasVideoConference: false },
  { id: "v4", name: "Meeting Room B", capacity: 8, hasVideoConference: false },
  {
    id: "v5",
    name: "Virtual Meeting (Zoom)",
    capacity: 100,
    hasVideoConference: true,
    isVirtual: true,
  },
  {
    id: "v6",
    name: "Virtual Meeting (Teams)",
    capacity: 100,
    hasVideoConference: true,
    isVirtual: true,
  },
];

// Agenda items matrix data
export const agendaItemsMatrix = [
  {
    id: 1,
    item: "Call to Order",
    regularBoard: true,
    annualGeneral: true,
    special: true,
    strategicPlanning: true,
    committeeReview: true,
  },
  {
    id: 2,
    item: "Approval of the Agenda",
    regularBoard: true,
    annualGeneral: true,
    special: true,
    strategicPlanning: true,
    committeeReview: true,
  },
  {
    id: 3,
    item: "Approval of Previous Meeting Minutes",
    regularBoard: true,
    annualGeneral: true,
    special: false,
    strategicPlanning: false,
    committeeReview: false,
  },
  {
    id: 4,
    item: "Chairperson's Report",
    regularBoard: true,
    annualGeneral: true,
    special: false,
    strategicPlanning: true,
    committeeReview: false,
  },
  {
    id: 5,
    item: "CEO/Executive Director's Report",
    regularBoard: true,
    annualGeneral: true,
    special: false,
    strategicPlanning: true,
    committeeReview: false,
  },
  {
    id: 6,
    item: "Financial Report",
    regularBoard: true,
    annualGeneral: true,
    special: false,
    strategicPlanning: false,
    committeeReview: false,
  },
  {
    id: 7,
    item: "Committee Reports",
    regularBoard: true,
    annualGeneral: true,
    special: false,
    strategicPlanning: false,
    committeeReview: true,
  },
  {
    id: 8,
    item: "Old Business (Unfinished Business)",
    regularBoard: true,
    annualGeneral: false,
    special: false,
    strategicPlanning: false,
    committeeReview: false,
  },
  {
    id: 9,
    item: "New Business",
    regularBoard: true,
    annualGeneral: true,
    special: true,
    strategicPlanning: true,
    committeeReview: true,
  },
  {
    id: 10,
    item: "Executive Session (Closed Session)",
    regularBoard: true,
    annualGeneral: true,
    special: true,
    strategicPlanning: false,
    committeeReview: false,
  },
  {
    id: 11,
    item: "Adjournment",
    regularBoard: true,
    annualGeneral: true,
    special: true,
    strategicPlanning: true,
    committeeReview: true,
  },
];

// Helper function to get default agenda items based on meeting type
export const getDefaultAgendaItems = (meetingType: string) => {
  let typeKey = "";
  switch (meetingType) {
    case "Regular Board Meeting":
      typeKey = "regularBoard";
      break;
    case "Annual General Meeting (AGM)":
      typeKey = "annualGeneral";
      break;
    case "Special (Extraordinary) Meeting":
      typeKey = "special";
      break;
    case "Strategic Planning Meeting":
      typeKey = "strategicPlanning";
      break;
    case "Committee Review Meeting":
      typeKey = "committeeReview";
      break;
    default:
      typeKey = "regularBoard";
  }

  return agendaItemsMatrix
    .filter((item) => item[typeKey as keyof typeof item] === true)
    .map((item) => ({
      id: item.id,
      title: item.item,
      selected: true,
      duration: 15, // Default duration in minutes
      presenter: "",
      notes: "",
    }));
};
