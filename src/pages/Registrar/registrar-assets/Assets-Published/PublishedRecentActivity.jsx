import dollarIcon from "@/assets/registrar-assets/black-dollar.svg";
import pendingIcon from "@/assets/registrar-assets/pending.svg";
import publishIcon from "@/assets/registrar-assets/publish.svg";
import eyeIcon from "@/assets/registrar-assets/eye.svg";
import saveIcon from "@/assets/registrar-assets/save.svg";

function PublishedRecentActivity() {
  const activities = [
    {
      id: 1,
      label: "Views (30 Days)",
      value: "5,342",
      icon: eyeIcon,
    },
    {
      id: 2,
      label: "Saves",
      value: "284",
      icon: saveIcon,
    },
    {
      id: 3,
      label: "Purchases",
      value: "12",
      icon: dollarIcon,
    },
    {
      id: 4,
      label: "Pending",
      value: "5",
      icon: pendingIcon,
    },
    {
      id: 5,
      label: "Published",
      value: "Nov 18, 2025",
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