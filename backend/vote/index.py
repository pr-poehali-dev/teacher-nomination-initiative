"""
Функции для голосования: получение учителей, голосование и результаты.
"""
import json
import os
import hashlib
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    """Обработчик голосования: GET /teachers?nomination_id=, POST /vote, GET /results?nomination_id="""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    if method == "GET" and action == "teachers":
        return get_teachers(event)
    elif method == "POST":
        return cast_vote(event)
    elif method == "GET" and action == "results":
        return get_results(event)

    return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Not found"})}


def get_teachers(event: dict) -> dict:
    params = event.get("queryStringParameters") or {}
    nomination_id = params.get("nomination_id")
    if not nomination_id:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "nomination_id required"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM teachers WHERE nomination_id = %s ORDER BY name", (int(nomination_id),))
    rows = cur.fetchall()
    conn.close()

    teachers = [{"id": r[0], "name": r[1]} for r in rows]
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"teachers": teachers})}


def cast_vote(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    nomination_id = body.get("nomination_id")
    teacher_id = body.get("teacher_id")
    ip = (event.get("requestContext") or {}).get("identity", {}).get("sourceIp", "unknown")

    if not nomination_id or not teacher_id:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "nomination_id and teacher_id required"})}

    fingerprint = hashlib.sha256(f"{ip}:{nomination_id}".encode()).hexdigest()

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM votes WHERE nomination_id = %s AND voter_fingerprint = %s", (nomination_id, fingerprint))
    if cur.fetchone():
        conn.close()
        return {"statusCode": 409, "headers": CORS_HEADERS, "body": json.dumps({"error": "already_voted"})}

    cur.execute(
        "INSERT INTO votes (nomination_id, teacher_id, voter_fingerprint) VALUES (%s, %s, %s)",
        (nomination_id, teacher_id, fingerprint),
    )
    conn.commit()
    conn.close()

    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"success": True})}


def get_results(event: dict) -> dict:
    params = event.get("queryStringParameters") or {}
    nomination_id = params.get("nomination_id")
    if not nomination_id:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "nomination_id required"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT t.id, t.name, COUNT(v.id) as vote_count
        FROM teachers t
        LEFT JOIN votes v ON v.teacher_id = t.id
        WHERE t.nomination_id = %s
        GROUP BY t.id, t.name
        ORDER BY vote_count DESC
        """,
        (int(nomination_id),),
    )
    rows = cur.fetchall()
    conn.close()

    results = [{"id": r[0], "name": r[1], "votes": r[2]} for r in rows]
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"results": results})}