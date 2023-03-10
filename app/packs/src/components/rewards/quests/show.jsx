import React, { useEffect } from "react";

import { railsContextStore, loggedInUserStore } from "src/contexts/state";

import TaskCard from "src/components/design_system/cards/TaskCard";
import Button from "src/components/design_system/button";
import { H3, P1 } from "src/components/design_system/typography";
import { ArrowLeft } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";
import { questDescription } from "src/utils/questsHelpers";

import cx from "classnames";

const QuestShow = ({ quest, railsContext }) => {
  const setRailsContext = railsContextStore(state => state.setRailsContext);
  const { mobile } = useWindowDimensionsHook();
  const { currentUser, fetchCurrentUser } = loggedInUserStore();

  useEffect(() => {
    setRailsContext(railsContext);
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <>
      <div className="mb-6">
        <a className="button-link" href="/earn?tab=quests">
          <Button
            onClick={() => null}
            type="white-ghost"
            size="icon"
            className="d-flex align-items-center justify-content-center mb-4"
          >
            <ArrowLeft color="currentColor" size={16} />
          </Button>
        </a>
        <H3 className="mb-3" bold text={quest.title} />
        <P1 className="text-primary-03" text={questDescription(quest.type)} />
      </div>
      {quest && (
        <div className={cx("w-100 d-flex flex-wrap", mobile ? "justify-content-center" : "justify-start")}>
          {quest.tasks.map(task => (
            <div key={task.id} className={cx("quest-card", "mt-4", !mobile && "pr-4")}>
              <TaskCard
                id={task.id}
                title={task.title}
                type={task.type}
                reward={task.reward}
                link={task.link}
                status={task.status}
                userId={currentUser?.id}
                userUsername={currentUser?.username}
                userProfileType={currentUser?.profile_type}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default (props, railsContext) => {
  return () => <QuestShow {...props} railsContext={railsContext} />;
};
