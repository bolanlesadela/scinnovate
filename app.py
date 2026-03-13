from flask import Flask, request, jsonify
import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



NEWS_API_KEY = "79090ca0a6c34aa48f55759a75d3f44a"
NEWS_URL = "https://newsapi.org/v2/everything"

SENDER_EMAIL = "randtingz01@gmail.com"
SENDER_PASSWORD = "lsqf xnet xhlh sqql"

def fetch_news(topics):
    query = " OR ".join(topics)
    params = {
        "q": query,
        "apiKey": NEWS_API_KEY,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 5
    }
    response = requests.get(NEWS_URL, params=params)
    data = response.json()
    return data.get("articles", [])

def build_email(articles, topics):
    html = f"""
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #F5F0EB; padding: 40px;">
        <div style="text-align: center; border-bottom: 2px solid #B48C6E; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 32px; color: #3D2B1F; margin: 0;">SciInnovate</h1>
            <p style="color: #A08060; font-style: italic; margin: 8px 0 0;">Your daily tech & science digest</p>
        </div>
        <p style="color: #6B4F3A; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
            Today's topics: {", ".join(topics)}
        </p>
    """
    for article in articles:
        html += f"""
        <div style="margin-bottom: 28px; border-left: 3px solid #B48C6E; padding-left: 16px;">
            <h3 style="color: #3D2B1F; margin: 0 0 8px; font-size: 16px;">{article['title']}</h3>
            <p style="color: #6B4F3A; font-size: 13px; margin: 0 0 8px;">{article.get('description', '')}</p>
            <a href="{article['url']}" style="color: #B48C6E; font-size: 12px; text-decoration: none;">Read more →</a>
        </div>
        """
    html += """
        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #DDD5CC; padding-top: 20px;">
            <p style="color: #A08060; font-size: 11px; letter-spacing: 2px;">SCINNOVATE — STAY CURIOUS</p>
        </div>
    </div>
    """
    return html

def send_email(to_email, html_content, topics):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"SciInnovate Daily: {', '.join(topics)}"
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

@app.route('/send-digest', methods=['POST'])
def send_digest():
    data = request.get_json()
    to_email = data.get("email")
    topics = data.get("topics", ["technology", "science"])

    if not to_email:
        return jsonify({"error": "Email is required"}), 400

    articles = fetch_news(topics)
    if not articles:
        return jsonify({"error": "No articles found"}), 404

    html = build_email(articles, topics)
    send_email(to_email, html, topics)

    return jsonify({"message": f"Digest sent to {to_email}"}), 200

if __name__ == '__main__':
    app.run(debug=True)