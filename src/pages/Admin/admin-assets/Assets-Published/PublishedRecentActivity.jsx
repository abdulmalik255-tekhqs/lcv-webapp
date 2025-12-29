import dollarIcon from "@/assets/registrar-assets/black-dollar.svg";
import pendingIcon from "@/assets/registrar-assets/pending.svg";
import publishIcon from "@/assets/registrar-assets/publish.svg";
import eyeIcon from "@/assets/registrar-assets/eye.svg";
import saveIcon from "@/assets/registrar-assets/save.svg";

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function PublishedRecentActivity({ asset }) {
  const activities = [
    {
      id: 1,
      label: "Views (30 Days)",
      value: "N/A", // Not available in API
      icon: eyeIcon,
    },
    {
      id: 2,
      label: "Saves",
      value: "N/A", // Not available in API
      icon: saveIcon,
    },
    {
      id: 3,
      label: "Purchases",
      value: "N/A", // Not available in API
      icon: dollarIcon,
    },
    {
      id: 4,
      label: "Pending",
      value: "N/A", // Not available in API
      icon: pendingIcon,
    },
    {
      id: 5,
      label: "Published",
      value: formatDate(asset?.updated_at) || "N/A",
      icon: publishIcon,
    },
  ];

  return (
    <div className="bg-white pt-8">
      <h4 className="text-[20px] font-[500] text-[#000] mb-6 !font-['Atacama']">
        Recent Activity
      </h4>

      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-1">
              <img
                src={activity.icon}
                alt={activity.label}
                className="w-3 h-3"
              />
              <span className="text-[11px] font-medium text-[#000]">{activity.label}</span>
            </div>
            <span className="text-[15px] text-[#000] font-normal">
              {activity.value}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-t border-[#D1D1D6]  border-1 mt-4 "></hr>

    </div>
  );
}

export default PublishedRecentActivity;