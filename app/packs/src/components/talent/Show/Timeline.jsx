import React, { useMemo } from "react";
import dayjs from "dayjs";

import { Caption, P2, P3 } from "src/components/design_system/typography";
import ProjectCard from "src/components/design_system/cards/project_card";

const Timeline = ({ sharedState, mode }) => {
  const sortedTimeline = useMemo(() => {
    return sharedState.milestones.sort((first, second) => {
      const firstDate = dayjs(first.start_date);
      const secondDate = dayjs(second.start_date);

      if (firstDate.isAfter(secondDate)) {
        return -1;
      } else if (firstDate.isBefore(secondDate)) {
        return 1;
      }
      return 0;
    });
  }, [sharedState.milestones]);

  return (
    <section className="d-flex flex-column mt-5 mr-lg-5">
      {sortedTimeline.map((milestone) => (
        <div
          key={`milestone_list_${milestone.id}`}
          className="d-flex flex-row w-100 mb-5"
        >
          <div className="col-2 d-flex flex-column">
            <Caption text={milestone.start_date} className="text-primary-04" />
          </div>
          <div className="col-10">
            <ProjectCard
              mode={mode}
              organization={milestone.institution}
              title={milestone.title}
              description={milestone.description}
              websiteLink={milestone.link}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default Timeline;
