"use client"

import Image from "next/image"

export function CoursesIllustration() {
  const sidebarItems = [
    { type: 'section', title: 'Stance', items: ['Stance Tutorial', 'Drill 1'], expanded: true },
    { type: 'section', title: 'Shape', items: ['Shape Tutorial', 'Drill 2'], expanded: false },
    { type: 'section', title: 'Rotation', items: ['Rotation Tutorial', 'Drill 3', 'Drill 4', 'Drill 5', 'Drill 6'], activeItem: 'Rotation Tutorial', expanded: true },
    { type: 'section', title: 'Follow-along Workouts', items: ['Workout 1'], expanded: true },
  ]

  const bulletPoints = [
    'Everything comes off of some level or rotation',
    'Opening and closing the hips with the pivot',
    'Rotating the shoulders',
    'Head stays still to maintain balance and accuracy',
    'Body rotates in gears to create kinetic chain',
  ]

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex shadow-lg">
      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden sm:flex w-[140px] sm:w-[160px] md:w-[220px] lg:w-[280px] bg-white border-r border-[#E5E5E5] flex-col overflow-hidden">
        {/* Grade Header */}
        <div className="p-2 sm:p-3 md:p-4 border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[#37322F] text-[11px] sm:text-xs md:text-base font-medium">Grade 1</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1 sm:h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div className="h-full w-[40%] bg-[#D4A84B] rounded-full" />
          </div>
          <span className="text-[#9CA3AF] text-[10px] sm:text-xs mt-1">40%</span>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto py-1 sm:py-2">
          {sidebarItems.map((section, sIdx) => (
            <div key={sIdx} className="mb-0.5 sm:mb-1">
              {/* Section Header */}
              <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-[#F5F5F5]">
                <span className="text-[#37322F] text-[10px] sm:text-xs md:text-sm font-medium">{section.title}</span>
                <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-[#9CA3AF] transition-transform ${section.expanded ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              {/* Section Items */}
              {section.expanded && (
                <div className="ml-1 sm:ml-2 md:ml-3">
                  {section.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[9px] sm:text-xs md:text-sm cursor-pointer rounded-md mx-0.5 sm:mx-1 md:mx-2 mb-0.5 ${
                        section.activeItem === item
                          ? 'bg-[#D4A84B]/15 text-[#B8860B] font-medium'
                          : 'text-[#6B7280] hover:text-[#37322F] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-3 md:p-6 lg:p-8 overflow-hidden bg-[#F5F5F5]">
        <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-6 h-full flex flex-col shadow-sm border border-[#E5E5E5]">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-6">
            <h2 className="text-[#37322F] text-sub font-semibold">Rotation Tutorial</h2>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>

          {/* Video Thumbnail */}
          <div className="relative w-full aspect-video bg-[#E5E5E5] rounded-md sm:rounded-lg overflow-hidden mb-2 sm:mb-3 md:mb-6 flex-shrink-0">
            <Image
              src="https://sb.oracleboxing.com/Website/coaching_tn_1.webp"
              alt="Rotation Tutorial"
              fill
              className="object-cover"
            />
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Duration */}
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 bg-black/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-white text-[10px] sm:text-xs md:text-sm">
              45:27
            </div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-1 sm:space-y-1.5 md:space-y-3 overflow-y-auto">
            {bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-[#37322F] rounded-full mt-1 sm:mt-1.5 md:mt-2 flex-shrink-0" />
                <span className="text-[#4B5563] text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CoachingIllustration() {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5]">
      {/* Video Grid Background - top row larger than bottom */}
      <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1" style={{ gridTemplateRows: '3fr 2fr' }}>
        {/* Oliver - top left with real photo */}
        <div className="relative bg-[#E5E5E5] overflow-hidden rounded-lg">
          <Image
            src="https://sb.oracleboxing.com/Website/ob_course_3.webp"
            alt="Oliver"
            fill
            className="object-cover"
          />
          {/* Name label */}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-[10px] md:text-xs">
            Oliver
          </div>
        </div>

        {/* You - top right */}
        <div className="relative bg-[#E8E8E8] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F0F0] to-[#E0E0E0]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#D0D0D0] flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-[#A0A0A0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          {/* You label - bottom right */}
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-white text-[10px] md:text-xs">
            You
          </div>
        </div>

        {/* Student 2 - bottom left */}
        <div className="relative bg-[#E8E8E8] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F0F0] to-[#E0E0E0]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#D0D0D0] flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-[#A0A0A0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-[10px] md:text-xs">
            Student
          </div>
        </div>

        {/* Toni - bottom right */}
        <div className="relative bg-[#E8E8E8] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F0F0] to-[#E0E0E0]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#D0D0D0] flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-[#A0A0A0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-[10px] md:text-xs">
            Toni
          </div>
        </div>
      </div>

      {/* Center Modal Card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[320px] md:max-w-[400px] bg-white rounded-xl overflow-hidden shadow-2xl border border-[#E5E5E5]">
          {/* Header Image/Banner */}
          <div className="relative h-24 md:h-32 overflow-hidden">
            <Image
              src="https://sb.oracleboxing.com/Website/skool_art2.jpg"
              alt="Shape Masterclass"
              fill
              className="object-cover"
            />
            {/* Three dots menu */}
            <div className="absolute top-3 right-3">
              <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="4" cy="10" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="16" cy="10" r="1.5" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3 className="text-[#37322F] text-title font-semibold mb-3">
              Shape Masterclass - Oliver
            </h3>

            {/* Date/Time */}
            <div className="flex items-start gap-3 mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-[#6B7280] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-[#37322F] text-xs md:text-sm">Tomorrow @ 9am - 10am</p>
                <p className="text-[#9CA3AF] text-[10px] md:text-xs">London time</p>
              </div>
            </div>

            {/* Zoom Link */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-[#2D8CFF] rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h10v10H4V4zm12 0v10l4-5V4h-4zm0 12H4v4h12v-4zm4-2v6h-4v-6h4z" />
                </svg>
              </div>
              <span className="text-[#2D8CFF] text-xs md:text-sm">Zoom link provided on join</span>
            </div>

            {/* Topics */}
            <div className="space-y-1 mb-4">
              <p className="text-[#49423D] text-xs md:text-sm">Why is shape so important?</p>
              <p className="text-[#49423D] text-xs md:text-sm">How do I setup my shape?</p>
              <p className="text-[#49423D] text-xs md:text-sm">How do I maintain it?</p>
            </div>

            <p className="text-[#6B7280] text-[10px] md:text-xs leading-relaxed mb-4">
              Being a smaller target makes boxing defensively and offensively very much easier!
            </p>

            {/* Add to Calendar Button */}
            <button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs md:text-sm font-medium py-2.5 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              ADD TO CALENDAR
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommunityIllustration() {
  // Member images from testimonials
  const memberImages = {
    bruno: "https://sb.oracleboxing.com/Website/1560863789646.jpeg",
    kris: "https://sb.oracleboxing.com/Website/kris.jpg",
    krisQ: "https://sb.oracleboxing.com/Website/kris_qually.webp",
    anton: "https://sb.oracleboxing.com/Website/anton.webp",
    meiyan: "https://sb.oracleboxing.com/Website/meiyan.webp",
    mike: "https://sb.oracleboxing.com/Website/Forouzanfar-M.-Uroloog_LR.webp",
    rod: "https://sb.oracleboxing.com/Website/rod.webp",
    leo: "https://sb.oracleboxing.com/Website/leo.webp",
    pascal: "https://sb.oracleboxing.com/Website/pascal.webp",
    thomas: "https://sb.oracleboxing.com/Website/thomas.webp",
  }

  const posts = [
    {
      author: "Bruno Martins",
      authorImage: memberImages.bruno,
      level: 6,
      time: "15h",
      category: "Questions",
      categoryIcon: "❓",
      title: "Why do YOU really box? (Be honest)",
      preview: "Everyone says \"discipline\" or \"fitness\"...but let's be real for a second 👇 People step into boxing for very different reasons. Some obvious. Some... not so much. I'll start For",
      likes: 28,
      comments: 171,
      commenters: [memberImages.kris, memberImages.anton, memberImages.meiyan, memberImages.rod],
      lastComment: "47m ago",
      pinned: true,
    },
    {
      author: "Kristopher Saville",
      authorImage: memberImages.kris,
      level: 7,
      time: "Dec '25",
      category: "Functionality",
      categoryIcon: "🏆",
      title: "NEW UPDATE!! Christmas Challenge - EMOM Burpees",
      preview: "🎅 PLEASE POST YOUR BURPEE VIDEOS ON THIS THREAD BELOW AS REQUESTED BY JORDAN 🎅",
      likes: 21,
      comments: 246,
      commenters: [memberImages.bruno, memberImages.leo, memberImages.pascal, memberImages.thomas],
      lastComment: "4h ago",
      pinned: true,
    },
    {
      author: "Mike Forouzanfar",
      authorImage: memberImages.mike,
      level: 5,
      time: "5d",
      category: "Weekly Video Submission",
      categoryIcon: "📹",
      title: "Week 5 - Revenge of the Hip Hinge",
      preview: "LAST WEEKS KEY TAKEAWAYS #1 Stance + Shape: Balance - Feet need to be gripping the ground - Hips stay hinged - they're unhinging/shifting forward with punches (which",
      likes: 15,
      comments: 56,
      commenters: [memberImages.krisQ, memberImages.meiyan, memberImages.rod, memberImages.anton],
      lastComment: "3h ago",
      pinned: true,
      newComment: true,
    },
  ]

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5]">
      {/* Posts Feed */}
      <div className="absolute inset-0 p-2 md:p-3 space-y-2 md:space-y-3 overflow-hidden">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 md:p-4 border border-[#E5E5E5] shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Author Avatar */}
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={post.authorImage} alt={post.author} fill className="object-cover" />
                  {/* Level badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-[#5865F2] rounded-full flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold border-2 border-white">
                    {post.level}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#37322F] text-xs md:text-sm font-semibold">{post.author}</span>
                    {post.author === "Kristopher Saville" && <span className="text-sm">🔥</span>}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs text-[#6B7280]">
                    <span>{post.time}</span>
                    <span>·</span>
                    <span>{post.categoryIcon}</span>
                    <span>{post.category}</span>
                  </div>
                </div>
              </div>
              {/* Pinned */}
              {post.pinned && (
                <div className="flex items-center gap-1 text-[#6B7280] text-[10px] md:text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Pinned</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-[#37322F] text-body font-semibold mb-1 line-clamp-1">
              {post.title.includes("🥊") ? post.title : (idx === 0 ? "🥊 " : "") + post.title}
            </h3>

            {/* Preview */}
            <p className="text-[#6B7280] text-[10px] md:text-xs line-clamp-2 mb-2 md:mb-3">
              {post.preview}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Likes */}
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <span className="text-sm">👍</span>
                  <span className="text-[10px] md:text-xs">{post.likes}</span>
                </div>
                {/* Comments */}
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-[10px] md:text-xs">{post.comments}</span>
                </div>
                {/* Commenters */}
                <div className="flex -space-x-1.5">
                  {post.commenters.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border-2 border-white">
                      <Image src={img} alt="commenter" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Last comment time */}
              <span className={`text-[10px] md:text-xs ${post.newComment ? 'text-green-600' : 'text-[#6B7280]'}`}>
                {post.newComment ? 'New comment ' : 'Last comment '}{post.lastComment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
