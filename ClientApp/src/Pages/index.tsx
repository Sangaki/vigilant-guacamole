
export function AppRouter() {
    return (
        <div>
            <Switch>
                <Route path="/projects" component={Projects} exact />
    <Route path="/projects/:id" component={ProjectDetails} />
    <Route path="/laborCosts" component={LaborCosts} exact />
    <Route path="/laborCosts/:id" component={LaborCostsComparison} />
    <Route path="/executors" component={ExecutorsList} exact />
    <Route path="/executors/:id" component={ExecutorHistory} />
    <Route path="/finance" component={FinancePage} />
    <Route path="/debts" component={Debts} />
    <Route path="/" component={NotFound} />
    </Switch>
    </div>
);
}
