import React, { useEffect } from 'react';
import supabase from '../Supabase';
const TestSupabase = () => {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('medication').select('*'); // 'test' = table name
      if (error) {
        console.error("❌ Supabase error:", error.message);
      } else {
        console.log("✅ Supabase connected. Data:", data);
      }
    };

    testConnection();
  }, []);

  return <h2>Check the console for Supabase test results</h2>;
};

export default TestSupabase;
