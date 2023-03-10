import React from "react";
import QuestCard from "src/components/design_system/cards/QuestCard";
import { H4, P1 } from "src/components/design_system/typography";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const Quests = ({ quests, withPersonaRequest }) => {
  const { mobile } = useWindowDimensionsHook();

  return (
    <div className="w-100 mt-6 mt-lg-7 pb-6 px-4 px-lg-0">
      <div className="mb-6 mb-lg-6">
        <H4 bold text="Quests" className="text-black mb-3" />
        <P1
          text="Get to know Talent Protocol through investing in Talent, set up your profile and be rewarded"
          className="text-primary-03"
        />
      </div>
      <div className={cx("d-flex flex-wrap", mobile ? "justify-content-center" : "justify-start")}>
        {quests.map(quest => (
          <div key={quest.type} className={cx("quest-card", "mt-4", !mobile && "pr-4")}>
            <QuestCard
              title={quest.title}
              subtitle={quest.subtitle}
              type={quest.type}
              allTasks={quest.tasks.length}
              completedTasks={quest.tasks.filter(task => task.status === "done").length}
              tasksType={quest.tasks.map(task => task.type)}
              status={quest.status}
              user={quest.user}
              withPersonaRequest={withPersonaRequest}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
