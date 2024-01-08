import { responseError, responseSuccess } from '@/app/_lib/PosResponse';
import { prisma } from '@/app/_lib/prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request, route: { params: { id: string } }) {
  const getProfile = await prisma.employees.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      avatar_url: true,
      name: true,
      employee_code: true,
    },
  });

  return responseSuccess({
    data: getProfile,
  });
}

export async function POST(req: Request, route: { params: { id: string } }) {
  const formData = await req.formData();
  console.log(formData.get('new-password') as string);
  const checkFirst = await prisma.employees.findUnique({
    where: {
      id: route.params.id,
    },
    select: {
      avatar_url: true,
      name: true,
      pin: true,
    },
  });

  if (!checkFirst) return responseError('User Not Found');

  const oldPassword = (formData.get('old-password') as string) ?? null;

  let newPassword = (formData.get('new-password') as string) ?? null;
  let rePassword = (formData.get('re-password') as string) ?? null;
  let isWithPassword = false;
  let finalPassword: any = null;
  if (oldPassword && newPassword && rePassword) {
    const matchRePass = newPassword === rePassword;
    if (!matchRePass) return responseError('Re-Password cant match with New Password');
    const match = compareSync(oldPassword, checkFirst.pin);
    if (!match) return responseError('Old Password is Wrong');
    finalPassword = hashSync(newPassword, 10);
    isWithPassword = true;
  }

  let fileName = null;
  let files = (formData.get('avatar') as File) ?? undefined;
  if (formData.has('avatar') && files.size !== 0) {
    const extension = files.type.split('/')[1];
    fileName = uuidv4() + '.' + extension;
  }

  const finalFileName = !fileName ? checkFirst.avatar_url : process.env.NEXT_URL + '/api/images/' + route.params.id + '/' + fileName;
  try {
    const UpdateProfile = await prisma.employees.update({
      where: {
        id: route.params.id,
      },
      data: {
        name: (formData.get('name') as string) ?? checkFirst.name,
        avatar_url: finalFileName,
        pin: finalPassword ?? checkFirst.pin,
      },
    });

    if (UpdateProfile)
      return responseSuccess({
        message: 'Update Profile Successfully',
        isWithPassword: isWithPassword,
        avatar_url: finalFileName,
      });
  } catch (e: any) {
    return responseError('Update Profile Failed');
  } finally {
    if (formData.has('avatar') && files.size !== 0) {
      const buffer = Buffer.from(await files.arrayBuffer());
      if (checkFirst.avatar_url) {
        await fetch(checkFirst.avatar_url, {
          method: 'DELETE',
        });
      }

      if (finalFileName) {
        const blob = new Blob([buffer], {
          type: files.type,
        });
        await fetch(finalFileName, {
          method: 'POST',
          body: blob,
        });
      }
    }

    await prisma.$disconnect();
  }

  return responseSuccess({
    message: 'Success Update',
  });
}
