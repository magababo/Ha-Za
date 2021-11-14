import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Colors } from '../components/utils/_var';

const FooterWrapper = styled.div`
  .footer {
    padding: 0.3rem 0.8rem;
    background-color: ${Colors.black};
    width: 100vw;
    border-top: 1px solid rgba(200, 200, 200, 0.3);
  }
  .sub-container {
    display: flex;
  }
  .link-label,
  .link,
  .copyright {
    color: ${Colors.mediumGray};
  }
  .link {
    cursor: pointer;
    text-decoration: none;
    min-width: 4.8rem;
    padding: 0.2rem 0 0 0.25rem;
    margin-bottom: 0.5rem;
    &:hover {
      color: ${Colors.green};
    }
  }
  .link-label {
    min-width: 7rem;
    padding: 0.1rem 0 0 0.25rem;
    text-align: left;
  }
  .copyright {
    min-width: 20rem;
    margin-right: 0;
    text-align: right;
  }
  .link-container {
    display: flex;
    padding: 0;
  }
  .container-empty {
    width: 100%;
  }
`;

function Footer() {
  const team = [
    {
      name: '김무현',
      repository: 'https://github.com/moo9205'
    },
    {
      name: '김용우',
      repository: 'https://github.com/magababo'
    },
    {
      name: '김태호',
      repository: 'https://github.com/TAETAEHO'
    },
    {
      name: '하경주',
      repository: 'https://github.com/TTurbo0824'
    }
  ];
  
  return (
    <FooterWrapper>
      <div className="footer">
        <div className="sub-container">
          <a
            className="link"
            href="https://github.com/Ha-Za/Ha-Za"
            target="_blank"
            rel="noopener noreferrer">
            Ha-Za Repository Link
          </a>
        </div>
        <div className="sub-container">
          <div className="link-container">
            <div className="link-label">Developed by</div>
            {team.map((member, idx) => (
              <a
                className="link"
                key={idx}
                href={member.repository}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} size="1x" color={Colors.lightGray} /> {member.name}
              </a>
            ))}
          </div>
          <div className="container-empty" />
          <span className="copyright">
            copyright &copy; {new Date().getFullYear()} Ha-Za All rights reserved.
          </span>
        </div>
      </div>
    </FooterWrapper>
  );
}

export default Footer;
