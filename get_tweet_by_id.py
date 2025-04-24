import asyncio
from twikit import Client
import os
from supabase import create_client, Client as SupabaseClient
import json

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: SupabaseClient = create_client(url, key)

USERNAME = 'ryuhosoy'
PASSWORD = 'Buchan-ryuhei1'

# Initialize client
client = Client('ja-JP')

async def main():
    try:
        # Try to load existing cookies first
        print("Loading cookies...")
        client.load_cookies("cookies.json")
        
        # Get all users from Supabase
        print("Fetching users from Supabase...")
        response = supabase.table('users').select('*').execute()
        users = response.data
        print(f"Found {len(users)} users")

        for user in users:
            print(f"\nProcessing user: {user['user_id']}")
            # Check if user has best_post_id_for_improve
            if user.get('best_post_id_for_improve'):
                best_post_id = user['best_post_id_for_improve']
                print(f"Best post ID: {best_post_id}")
                
                # Get the posted post details
                print("Fetching posted post details...")
                post_response = supabase.table('posted_posts').select('*').eq('posted_post_id', best_post_id).execute()
                
                if post_response.data and len(post_response.data) > 0:
                    posted_post = post_response.data[0]
                    tweet_id = posted_post['posted_post_id']
                    print(f"Found tweet ID: {tweet_id}")
                    
                    try:
                        # Get tweet KPIs
                        print("Fetching tweet KPIs...")
                        tweet = await client.get_tweet_by_id(tweet_id)
                        
                        # Prepare KPI data
                        kpi_data = {
                            'text': tweet.text,
                            'favorite_count': tweet.favorite_count,
                            'tweet_id': tweet_id
                        }
                        print(f"KPI data: {kpi_data}")
                        
                        # Update user's kpi_data in Supabase
                        print("Updating KPI data in Supabase...")
                        supabase.table('users').update({
                            'kpi_data': json.dumps(kpi_data)
                        }).eq('user_id', user['user_id']).execute()
                        print("KPI data updated successfully")
                        
                    except Exception as e:
                        print(f"Error getting tweet data for user {user['user_id']}: {str(e)}")
                else:
                    print(f"No posted post found for best_post_id: {best_post_id}")
            else:
                print("User has no best_post_id_for_improve")
                        
    except Exception as e:
        # If cookies are invalid or any error occurs, perform new login
        print(f"Error occurred: {str(e)}")
        print("Attempting new login...")
        await client.login(
            auth_info_1=USERNAME,
            password=PASSWORD,
        )
        client.save_cookies("cookies.json")
        print("Login successful, retrying main logic...")
        # Retry the main logic after login
        await main()

asyncio.run(main())
