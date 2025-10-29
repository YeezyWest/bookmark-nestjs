import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module.js';
import pactum from 'pactum';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { AuthDto } from '../src/auth/dto/auth.dto.js';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(0);
    const httpServer =
      app.getHttpServer() as unknown as {
        address: () => { port: number };
      };
    const { port } = httpServer.address();
    pactum.request.setBaseUrl(
      `http://localhost:${port}`,
    );
    prisma = moduleRef.get<PrismaService>(
      PrismaService,
    );

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'yadeshin57@gmail.com',
      password: '123456789',
    };
    describe('SignUp', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('SignIn', () => {
      const dto: AuthDto = {
        email: 'yadeshin57@gmail.com',
        password: '123456789',
      };
      let accessToken: string;
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: '',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .inspect()
          .stores(
            'userAccessToken',
            'access_token',
          );
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });

    // describe('Edit Me', () => {
    //   it('should edit me', () => {
    //     return pactum
    //       .spec()
    //       .patch('/user/me')
    //       .withBody({
    //         name: 'Yusuf',
    //       })
    //       .expectStatus(200);
    //   });
    // });
  });

  // describe('Bookmark', () => {
  //   describe('Create Bookmark', () => {});
  //   describe('Get Bookmarks', () => {});
  //   describe('Get Bookmark by id', () => {});
  //   describe('Edit Bookmark id', () => {});
  //   describe('Delete Bookmark id', () => {});
  // });
});
