you are a front-end, UI & UX expert. Build a mockup and output the code compatable with Mermaid based on the requirement below. Ask any questions you may have and plan the design first. Only generate the code once all ambiguity is removed

I'd like to build a UI mockup in mermaid. With the following components on  a webpage.

A. Header
Agent Manager box, showing:
Status: running/waiting/stopped/errors
Active agents: (count) out of 10
Task Queue: (count) out of (total)

B. Sidebar (Navigation Menu)
- Dashboard
- Agents
- Tasks
- Logs
- Settings

1. Dashboard
This is the main control panel and should have the following elements:
- a chat window to receive escalations and decisions from the agents. 
- an input area below the chat window to instruct the agents on next steps and a submit button

2. Agents
- a seperate component for each agent, arranged in a grid of 3 across, that shows:
- the role of the agent and an indicator is if the agent is working or idle or in an error state 
- a task queue: To Do: (count), In progress: (count), Done (count), Failed(count)
- current task
- a chat window showing any output/feedback from the agent on the current task it is working on
- an indicator of who the agent is engaged with/handing-off to

The Agents section can exist on the Dashboard, below the chat & response window

3. Tasks
A grid monitoring the plan of tasks and their completion (in sequence) including columns:
- Name of task
- Status: To do, WIP, Done, Error, Waiting
- Role of agent to perform task
- Time taken (if complete)
- Any feedback/error/missing information

4. Logs
JSONL output of all the agents clealry marked with each agent performing it, the name of the task and any debug information

5. Settings
Max agents allowed: 10
Health check interval (ms): 10000
Max retries: 3
Queue size: 3
Process interval (ms): 1000
Priority levels: 10
Agent (1-n) with file attchment for the role description they are fulfilling