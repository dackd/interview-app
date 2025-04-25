import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { create } from "domain";
import { db } from "@/firebase/admin";

// export const GET = async () => {
//   return Response.json({ success: true, name: "dackd" });
// };

export const POST = async (req: Request) => {
  const { type, role, level, techstack, amount, userid } = await req.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Chuẩn bị các câu hỏi cho một buổi phỏng vấn xin việc.
      Vai trò công việc là ${role}.
      Mức độ kinh nghiệm công việc là ${level}.
      Công nghệ được sử dụng trong công việc là: ${techstack}.
      Sự tập trung giữa câu hỏi hành vi và kỹ thuật nên nghiêng về: ${type}.
      Số lượng câu hỏi cần thiết là: ${amount}.
      Vui lòng chỉ trả về các câu hỏi, không có bất kỳ văn bản bổ sung nào.
      Các câu hỏi sẽ được đọc bởi một trợ lý giọng nói, vì vậy không sử dụng "/" hoặc "*" hoặc bất kỳ ký tự đặc biệt nào khác có thể làm hỏng trợ lý giọng nói.
      Trả về các câu hỏi được định dạng như sau:
      ["Câu hỏi 1", "Câu hỏi 2", "Câu hỏi 3"]
      
      Cảm ơn bạn! <3
    `,
    });

    console.log("body", { type, role, level, techstack, amount, userid });
    console.log("questions", questions);

    const interview = {
      role,
      type,
      level,
      userId: userid,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
};
