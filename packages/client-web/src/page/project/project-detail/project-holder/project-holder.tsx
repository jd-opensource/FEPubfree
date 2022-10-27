import { isEmpty } from "lodash-es";
import React, { useCallback, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import Api, { EApiCode } from "../../../../api";

const ProjectHolder: React.FC = (props) => {
  const { projectId } = useParams() as { projectId: string };
  const [envAreas, setEnvAreas] = useState([]);

  const fetchEnvAreas = useCallback(async () => {
    const res = await Api.project.getProjectEnvs(+projectId);
    if (res.code === EApiCode.Success) {
      setEnvAreas(res.data);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEnvAreas();
  }, []);

  if (isEmpty(envAreas)) {
    return null;
  }

  const envId = envAreas[0].id;
  return <Redirect to={`/projects/${projectId}/workspaces/${envId}`} />;
};

export default ProjectHolder;
