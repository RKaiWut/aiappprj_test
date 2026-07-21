from uuid import uuid4
from typing import Any

# In-memory session store
_sessions: dict[str, dict[str, Any]] = {}


def create_session(assessment: dict, prediction: dict) -> str:
    """
    Creates a new chatbot session and returns the session ID.
    """
    session_id = str(uuid4())

    _sessions[session_id] = {
        "assessment": assessment,
        "prediction": prediction,
        "messages": [],
    }

    return session_id


def get_session(session_id: str) -> dict | None:
    """
    Returns the session dictionary or None if not found.
    """
    return _sessions.get(session_id)


def add_user_message(session_id: str, message: str) -> None:
    session = get_session(session_id)

    if session is None:
        raise ValueError("Session not found.")

    session["messages"].append({
        "role": "user",
        "content": message
    })


def add_assistant_message(session_id: str, message: str) -> None:
    session = get_session(session_id)

    if session is None:
        raise ValueError("Session not found.")

    session["messages"].append({
        "role": "assistant",
        "content": message
    })


def get_messages(session_id: str) -> list[dict]:
    session = get_session(session_id)

    if session is None:
        raise ValueError("Session not found.")

    return session["messages"]


def clear_session(session_id: str) -> None:
    _sessions.pop(session_id, None)