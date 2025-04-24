import asyncio
from twikit import Client

USERNAME = 'ryuhosoy'
PASSWORD = 'Buchan-ryuhei1'

# Initialize client
client = Client('ja-JP')

async def main():
    try:
        # Try to load existing cookies first
        client.load_cookies("cookies.json")
        # Test if cookies are still valid by making a simple API call
        # データベースからKPI取得用の投稿のtweetidを取得してきて、そのツイートのKPIを取得し、データベースに保存
        tweet_id = '1909247739616960979'
        tweet = await client.get_tweet_by_id(tweet_id)
    except Exception as e:
        # If cookies are invalid or any error occurs, perform new login
        await client.login(
            auth_info_1=USERNAME,
            password=PASSWORD,
        )
        client.save_cookies("cookies.json")
        # Now try to get the tweet
        tweet = await client.get_tweet_by_id(tweet_id)

    print("get_tweet_by_id tweet", tweet)
    print("get_tweet_by_id tweet.text", tweet.text)
    print("get_tweet_by_id tweet.favorite_count", tweet.favorite_count)

asyncio.run(main())
