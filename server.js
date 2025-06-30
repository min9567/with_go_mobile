const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const webpush = require("web-push");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY
);

function getKstISOString() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace("Z", "+09:00");
}

webpush.setVapidDetails(
    'mailto:kimyoott@naver.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

app.use((req, res, next) => {
  console.log(`[요청 감지] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API 서버 정상 작동 중");
});

app.get("/place-options", async (req, res) => {
  const { data, error } = await supabase
    .from("storage_place")
    .select("name, address");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.get("/arrival-options", async (req, res) => {
  const { data, error } = await supabase
    .from("partner_place")
    .select("name, address");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.post("/delivery", async (req, res) => {
  const {
    name,
    phone,
    startValue,
    endValue,
    deliveryDate,
    count,
    twocount,
    indown,
    user_id,
  } = req.body;

  const { data, error } = await supabase
    .from("delivery")
    .insert([
      {
        name,
        phone,
        delivery_start: startValue,
        delivery_arrive: endValue,
        delivery_date: deliveryDate,
        under: count,
        over: twocount,
        price: indown,
        user_id,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const re_num = data.re_num;
  const now = new Date().toISOString();

  await supabase.from("status_logs").insert([
    {
      table_name: "delivery",
      key_value: re_num,
      prev_status: "접수",
      new_status: "접수",
      updated_at: getKstISOString(),
      received_at: getKstISOString(),
      operator: "",
    },
  ]);

  res.json({ success: true, data });
});

app.post("/delivery-cancel", async (req, res) => {
  const { re_num, user_id } = req.body;

  // 1. 이전 상태 조회
  const { data: prevRow, error: prevError } = await supabase
    .from("delivery")
    .select("situation")
    .eq("re_num", re_num)
    .eq("user_id", user_id)
    .single();

  if (prevError) return res.status(500).json({ error: prevError.message });

  const prevStatus = prevRow?.situation || "";

  // 2. 상태 업데이트
  const { error } = await supabase
    .from("delivery")
    .update({ situation: "취소" })
    .eq("re_num", re_num)
    .eq("user_id", user_id);

  if (error) return res.status(500).json({ error: error.message });

  // 3. 로그 남기기
  await supabase.from("status_logs").insert([
    {
      table_name: "delivery",
      key_value: re_num,
      prev_status: prevStatus,
      new_status: "취소",
      updated_at: getKstISOString(),
      received_at: getKstISOString(),
      operator: "사용자",
    },
  ]);

  res.json({ success: true });
});


app.post("/my-delivery-list", async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from("delivery")
    .select("*")
    .eq("user_id", user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.post("/delivery-info", async (req, res) => {
  const { re_num } = req.body;
  const { data, error } = await supabase
    .from("deliveryList")
    .select("driver_name, driver_phone, photo_url, f_time")
    .eq("re_num", re_num)
    .single();
  if (error || !data) {
    return res.json({
      driver_name: null,
      driver_phone: null,
      photo_url: null,
      f_time: null
    });
  }
  res.json(data);
});

app.post("/storage", async (req, res) => {
  const {
    name,
    phone,
    startDate,
    endDate,
    selectValue,
    count,
    twocount,
    threecount,
    indown,
    user_id,
  } = req.body;

  const { data, error } = await supabase
    .from("storage")
    .insert([
      {
        name,
        phone,
        storage_start_date: startDate,
        storage_end_date: endDate,
        location: selectValue,
        small: count,
        medium: twocount,
        large: threecount,
        price: indown,
        user_id,
        situation: "접수"
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const reservation_number = data.reservation_number;
  const now = new Date().toISOString();

  await supabase.from("status_logs").insert([
    {
      table_name: "storage",
      key_value: reservation_number,
      prev_status: "접수",
      new_status: "접수",
      updated_at: getKstISOString(),
      received_at: getKstISOString(),
      operator: "",
    },
  ]);

  res.json({ success: true, data });
});

app.post("/storage-cancel", async (req, res) => {
  const { reservation_number, user_id } = req.body;

  // 1. 이전 상태 조회
  const { data: prevRow, error: prevError } = await supabase
    .from("storage")
    .select("situation")
    .eq("reservation_number", reservation_number)
    .eq("user_id", user_id)
    .single();

  if (prevError) return res.status(500).json({ error: prevError.message });

  const prevStatus = prevRow?.situation || "";

  // 2. 상태값 업데이트
  const { error } = await supabase
    .from("storage")
    .update({ situation: "취소" })
    .eq("reservation_number", reservation_number)
    .eq("user_id", user_id);

  if (error) return res.status(500).json({ error: error.message });

  // 3. 로그 남기기
  await supabase.from("status_logs").insert([
    {
      table_name: "storage",
      key_value: reservation_number,
      prev_status: prevStatus,     // 실제 이전 상태값이 들어감
      new_status: "취소",
      updated_at: getKstISOString(),
      received_at: getKstISOString(),
      operator: "사용자",
    },
  ]);

  res.json({ success: true });
});


app.post("/my-storage-list", async (req, res) => {
  const { user_id } = req.body;

  const { data, error } = await supabase
    .from("storage")
    .select("*")
    .eq("user_id", user_id)
    .order("reservation_time", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.post("/status-logs", async (req, res) => {
  const key_value = req.body.reservation_number || req.body.re_num;

  const { data: rawLogs, error: logsError } = await supabase
    .from("status_logs")
    .select("*")
    .eq("key_value", key_value)
    .order("updated_at", { ascending: false });

  if (logsError) return res.status(500).json({ error: logsError.message });

  let location = null;
  if (req.body.reservation_number) {
    const { data: storage, error: storageError } = await supabase
      .from("storage")
      .select("location")
      .eq("reservation_number", req.body.reservation_number)
      .single();
    if (!storageError) location = storage?.location || null;
  } else if (req.body.re_num) {
    const { data: delivery, error: deliveryError } = await supabase
      .from("delivery")
      .select("delivery_start")
      .eq("re_num", req.body.re_num)
      .single();
    if (!deliveryError) location = delivery?.delivery_start || null;
  }

  const logs = (rawLogs || []).map((log) => {
    const kstUpdated = new Date(log.updated_at).toLocaleString("sv-SE", {
      timeZone: "Asia/Seoul",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return { ...log, updated_at: kstUpdated };
  });

  res.json({
    logs,
    location,
  });
});

app.post("/alert/subscribe", async (req, res) => {
  console.log("✅ POST /alert/subscribe 호출됨");

  const { user_id, subscription } = req.body;

  if (!user_id || !subscription) {
    return res.status(400).json({ message: "user_id 또는 subscription 누락" });
  }

  // 중복 여부 확인
  const { data: existing, error: fetchError } = await supabase
      .from("subscription")
      .select("id")
      .eq("user_id", user_id)
      .maybeSingle();

  if (fetchError) {
    console.error("❌ Supabase 조회 실패:", fetchError);
    return res.status(500).json({ message: "조회 중 오류 발생" });
  }

  if (existing) {
    // 이미 존재하면 update
    const { error: updateError } = await supabase
        .from("subscription")
        .update({
          subscription,
          created_at: getKstISOString(),
        })
        .eq("user_id", user_id);

    if (updateError) {
      console.error("❌ Supabase update 실패:", updateError);
      return res.status(500).json({ message: "구독 갱신 실패", error: updateError.message });
    }

    return res.status(200).json({ message: "기존 구독 갱신 성공" });
  } else {
    // 존재하지 않으면 insert
    const { error: insertError } = await supabase
        .from("subscription")
        .insert({
          user_id,
          subscription,
          created_at: getKstISOString(),
        });

    if (insertError) {
      console.error("❌ Supabase insert 실패:", insertError);
      return res.status(500).json({ message: "구독 저장 실패", error: insertError.message });
    }

    return res.status(200).json({ message: "새 구독 저장 성공" });
  }
});

app.post("/alert/check-subscription", async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ exists: false });

  const { data, error } = await supabase
      .from("subscription")
      .select("id")
      .eq("user_id", user_id);

  if (error) {
    console.error("❌ Supabase 조회 실패:", error.message);
    return res.status(500).json({ exists: false });
  }

  res.json({ exists: data.length > 0 });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
