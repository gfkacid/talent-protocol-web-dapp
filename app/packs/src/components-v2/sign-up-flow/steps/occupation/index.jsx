import { Pills, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { TitleRow, PillsContainer } from "./styled";

export const OccupationStep = ({ user, setUser, setIsNextDisable }) => {
  const [tags, setTags] = useState(
    [
      {
        content: "Web3",
        isSelected: false
      },
      {
        content: "Crypto",
        isSelected: false
      },
      {
        content: "Blockchain",
        isSelected: false
      },
      {
        content: "NFTs",
        isSelected: false
      },
      {
        content: "Startups",
        isSelected: false
      },
      {
        content: "Marketing",
        isSelected: false
      },
      {
        content: "Design",
        isSelected: false
      },
      {
        content: "Entrepreneurship",
        isSelected: false
      },
      {
        content: "Defi",
        isSelected: false
      },
      {
        content: "Strategy",
        isSelected: false
      },
      {
        content: "Product",
        isSelected: false
      },
      {
        content: "Education",
        isSelected: false
      },
      {
        content: "Founder",
        isSelected: false
      },
      {
        content: "Developer",
        isSelected: false
      },
      {
        content: "Product Design",
        isSelected: false
      },
      {
        content: "Music",
        isSelected: false
      },
      {
        content: "Innovation",
        isSelected: false
      },
      {
        content: "Writer",
        isSelected: false
      },
      {
        content: "Content creator",
        isSelected: false
      }
    ].map(value => {
      const parsedValue = { ...value };
      if (user.tags.includes(value.content)) {
        parsedValue.isSelected = true;
      }
      return parsedValue;
    })
  );
  const updatePills = useCallback(
    index => {
      const parsedTags = [...tags];
      parsedTags[index].isSelected = !parsedTags[index].isSelected;
      setTags(parsedTags);
      setUser({
        ...user,
        tags: parsedTags.reduce((acc, el) => {
          if (el.isSelected) {
            acc.push(el.content);
          }
          return acc;
        }, [])
      });
      if (parsedTags.some(pill => pill.isSelected)) {
        setIsNextDisable(false);
      } else {
        setIsNextDisable(true);
      }
    },
    [tags, setTags, user, setUser]
  );
  useEffect(() => {
    if (user.tags.length) {
      requestAnimationFrame(() => {
        setIsNextDisable(false);
      })
    }
  }, [user]);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          What best describes your occupation?
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          Choose at least 1 tag. You can add more later.
        </Typography>
      </TitleRow>
      <PillsContainer>
        <Pills onClick={updatePills} pillList={tags} />
      </PillsContainer>
    </>
  );
};
