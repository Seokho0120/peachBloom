import { Session as NextAuthSession } from 'next-auth';
import LoginIcon from './ui/LoginIcon';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { LoginStatusAtom } from '@/atoms/LoginStatusAtom';

interface AuthButtonProps {
  session: NextAuthSession | null;
  onSignOut: () => void;
  onSignIn: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  session,
  onSignOut,
  onSignIn,
}) => {
  const setIsLoggedIn = useSetRecoilState(LoginStatusAtom);
  const router = useRouter();

  const handleClick = async () => {
    if (session) {
      await onSignOut();
      setIsLoggedIn(false);
      // router.push('/');
    } else {
      onSignIn();
      setIsLoggedIn(true);
    }
  };
  // const handleClick = session ? onSignOut : onSignIn;
  const buttonText = session ? 'LOGOUT' : 'LOGIN';

  return (
    <button onClick={handleClick} className='flex items-center gap-1'>
      <LoginIcon />
      <p className='text-xs'>{buttonText}</p>
    </button>
  );
};

export default AuthButton;
