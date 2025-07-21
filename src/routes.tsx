import type { FC } from "react";
import { Route, Switch } from "wouter";
import { FrontEndQuiz } from "@/routes/quizzes/frontend-framework";
import { Results } from "@/routes/results";

export const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/" component={FrontEndQuiz} />
      <Route path="/results" component={Results} />
      <Route>404: No such page!</Route>
    </Switch>
  );
};
