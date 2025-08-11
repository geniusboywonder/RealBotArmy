from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class AgentType(str, Enum):
    ANALYST = "analyst"
    ARCHITECT = "architect" 
    DEVELOPER = "developer"
    TESTER = "tester"
    DEPLOYER = "deployer"

class AgentStatus(str, Enum):
    IDLE = "idle"
    THINKING = "thinking"
    WAITING = "waiting"
    ERROR = "error"

class MessageType(str, Enum):
    HANDOFF = "handoff"
    CONFLICT = "conflict"
    AGREEMENT = "agreement"
    ESCALATION = "escalation"

class MessageContent(BaseModel):
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    attachments: List[str] = Field(default_factory=list)

class AgentMessage(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    from_agent: str
    to_agent: Optional[str] = None
    message_type: MessageType
    content: MessageContent
    thread_id: str
    attempt_number: int = 1

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Agent(BaseModel):
    id: str
    type: AgentType
    name: str
    status: AgentStatus = AgentStatus.IDLE
    current_task: Optional[str] = None
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(0.0, ge=0.0, le=1.0)

class HumanAction(BaseModel):
    id: str
    priority: str = Field(..., regex="^(low|medium|high|urgent)$")
    title: str
    description: str
    options: List[Dict[str, str]]
    deadline: Optional[datetime] = None
    context: Dict[str, Any] = Field(default_factory=dict)

class ProjectSpec(BaseModel):
    project_id: str
    version: int = 1
    updated_by: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    changes: List[str] = Field(default_factory=list)
    spec: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, Any]] = Field(default_factory=list)
