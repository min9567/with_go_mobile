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

// ✅ 푸시 구독 저장 API
app.post("/subscribe", async (req, res) => {
  console.log("✅ POST /subscribe 호출됨");

  if (!req.body) {
    console.error("❌ body가 없음");
    return res.status(400).json({ message: "body 없음" });
  }

  const { user_id, subscription } = req.body;

  if (!user_id || !subscription) {
    console.error("❌ 필수 항목 누락됨", req.body);
    return res.status(400).json({ message: "user_id 또는 subscription 누락" });
  }

  console.log("💬 받은 구독 데이터:", user_id, subscription);

  const { error } = await supabase
      .from("subscription")
      .insert({
        user_id,
        subscription, // ✅ JSON.stringify 제거: Supabase가 json으로 인식
        created_at: getKstISOString(),
      });

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return res.status(400).json({ message: "DB insert 실패", error: error.message });
  }

  res.status(200).json({ message: "구독 성공", received: true });
});

// ✅ 푸시 전송 API
app.post("/send", async (req, res) => {
  const { title, body, url } = req.body;
  const payload = JSON.stringify({ title, body, url });

  const { data: subscribers, error } = await supabase
      .from("subscription")
      .select("*");

  if (error) {
    console.error("❌ Supabase SELECT 실패", error);
    return res.status(500).json({ error: error.message });
  }

  if (!subscribers || subscribers.length === 0) {
    return res.status(400).json({ error: "등록된 구독 정보가 없습니다." });
  }

  const results = await Promise.allSettled(
      subscribers.map((s, idx) => {
        let subObj = s.subscription;

        try {
          if (typeof subObj === "string") {
            subObj = JSON.parse(subObj);
            if (typeof subObj === "string") {
              subObj = JSON.parse(subObj);
            }
          }
        } catch (e) {
          console.error(`❌ [${idx}] JSON 파싱 실패:`, e);
          return Promise.reject(e);
        }

        return webpush.sendNotification(subObj, payload).catch((err) => {
          console.error(`🚨 [${idx}] 푸시 전송 실패:`, err);
          return Promise.reject(err);
        });
      })
  );

  console.log("✅ 푸시 전송 결과:", results);

  res.status(200).json({ message: "알림 전송 완료", results });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
