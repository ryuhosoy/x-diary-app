import asyncio
from twikit import Client
import os
from supabase import create_client, Client
import json

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

USERNAME = 'ryuhosoy'
PASSWORD = 'Buchan-ryuhei1'

# Initialize client
client = Client('ja-JP')

async def main():
    try:
        # Try to load existing cookies first
        client.load_cookies("cookies.json")
        
        # Get all users from Supabase
        response = supabase.table('users').select('*').execute()
        users = response.data

        for user in users:
            # Check if user has best_post_id_for_improve
            if user.get('best_post_id_for_improve'):
                best_post_id = user['best_post_id_for_improve']
                
                # Get the posted post details
                post_response = supabase.table('posted_posts').select('*').eq('posted_post_id', best_post_id).execute()
                
                if post_response.data and len(post_response.data) > 0:
                    posted_post = post_response.data[0]
                    tweet_id = posted_post['posted_post_id']
                    
                    try:
                        # Get tweet KPIs
                        tweet = await client.get_tweet_by_id(tweet_id)
                        
                        # Prepare KPI data
                        kpi_data = {
                            'text': tweet.text,
                            'favorite_count': tweet.favorite_count,
                            'tweet_id': tweet_id
                        }
                        
                        # Update user's kpi_data in Supabase
                        supabase.table('users').update({
                            'kpi_data': json.dumps(kpi_data)
                        }).eq('user_id', user['user_id']).execute()
                        
                    except Exception as e:
                        print(f"Error getting tweet data for user {user['user_id']}: {str(e)}")
                        
    except Exception as e:
        # If cookies are invalid or any error occurs, perform new login
        await client.login(
            auth_info_1=USERNAME,
            password=PASSWORD,
        )
        client.save_cookies("cookies.json")
        # Retry the main logic after login
        await main()

asyncio.run(main())
