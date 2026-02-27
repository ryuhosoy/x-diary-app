import { supabase } from "@/app/utils/supabase";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
import { validateAccountSettings } from '@/app/lib/validation';

export async function POST(request: Request) {
  try {
    const accountSettings = await request.json();

    const validation = validateAccountSettings(accountSettings);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `${validation.field}は必須です` },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const user_id = cookieStore.get('user_id')?.value;

    // ユーザーのアカウント設定を更新
    const { error: updateError } = await supabase
      .from('users')
      .update({
        account_settings: accountSettings,
      })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Error updating account settings:', updateError);
      return NextResponse.json(
        { error: '設定の更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '設定を更新しました' });
  } catch (error) {
    console.error('Error in account settings update:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 