import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProfilePageLinksProps {
  setActiveLink: (link: string) => void
  profilePageUserId: string
  loggedInUserId: string
}

const ProfilePageLinks: React.FC<ProfilePageLinksProps> = ({
  setActiveLink,
  loggedInUserId,
  profilePageUserId,
}) => {
  const pathname = usePathname()
  const isActive = (path: string): boolean =>
    pathname === `/ProfilePageLinks/${path}`

  const activeLinkClass = "text-[#10676B]"
  const linkClass =
    "flex items-center px-1 py-1 sm:px-2 sm:py-2 md:px-3 md:py-2 lg:px-4 lg:py-2 hover:text-[#85b3b6] hover:bg-[#F2F2F2] rounded"

  return (
    <section
      className="flex relative flex-col sm:flex-row justify-between items-center border border-gray-100 tb:ml-[120px] tbbb:ml-[130px] md:ml-[160px] tb:w-[320px] tbbb:w-[370px] tbb:w-[490px] md:w-[540px] mdc:w-[570px] mdd:w-[760px] lg:w-[770px] mddd:w-[570px] lgg:w-[750px] lggg:w-[940px]
    shadow-sm bg-white px-4 py-2"
    >
      <nav>
        <ul className="flex justify-around w-full text-sm space-x-1 sbb:space-x-2  tb:space-x-1 tbbb:space-x-4 tbb:space-x-6 md:space-x-4 lggg:space-x-10  p-3 left-7 top-3 ">
          {["Posts", "NFTs", "Media", "Friends", "Saved"].map((link) => {
            if (profilePageUserId !== loggedInUserId && link === "Saved") return

            return (
              <li key={link}>
                <div
                  className={`${linkClass} ${
                    isActive(link) ? activeLinkClass : ""
                  }`}
                  onClick={() => setActiveLink(link)}
                >
                  {link}
                </div>
              </li>
            )
          })}
          <li
            key="About"
            className="block  mdc:block mddd:block mdd:hidden lg:hidden lgg:hidden lggg:hidden"
          >
            <div
              className={`${linkClass} ${
                isActive("About") ? activeLinkClass : ""
              }`}
              onClick={() => setActiveLink("About")}
            >
              About
            </div>
          </li>
        </ul>
      </nav>
    </section>
  )
}

export default ProfilePageLinks
