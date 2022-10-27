import React from "react";
import { Redirect, useParams } from "react-router-dom";

const GroupHolder: React.FC = (props) => {
  const { groupId } = useParams() as { groupId: string };

  return <Redirect to={`/groups/${groupId}/projects`} />;
};

export default GroupHolder;
