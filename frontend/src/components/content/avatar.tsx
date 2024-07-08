import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const AvatarComponent = () => {
    return (
    <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      )
}

export default AvatarComponent